# FSdiscover — Codebase Documentation

This document explains the FSdiscover repository structure, architecture, runtime behaviour, key modules, HTTP and socket APIs, initialization flow, launcher behaviour, and notes about data files and configuration. It focuses on the server-side app, supporting utilities, and the front-end client shipped in `fe/`.

---

## Table of Contents

- Repo layout
- High-level architecture
- How FSdiscover starts (launchers & index.js)
- Runtime config and initialization
- Authentication, visitors & sessions
- HTTP routes and behaviour
- Socket handling and remote control
- File-system operations & upload/download
- Utilities (logger, exec, render, networkProbe)
- Frontend structure (fe/)
- Launcher scripts and `__prefer`
- Important files (short reference)
- Troubleshooting & common behaviours

---

## Repo layout (top-level)

- `index.js` — main server bootstrap and TUI.
- `package.json` — Node dependencies and scripts.
- `fsdiscover.sh`, `fsdiscover.cmd` — platform launchers.
- `auth.config.json` — persistent auth/visitors file (created at runtime).
- `runtime.config.json` — persisted runtime configuration (created/updated at runtime).
- `__init` — runtime marker file written after successful `/init`.
- `utils/` — server helper modules (handlers, logger, runtime config, admin router, etc.).
- `fe/` — front-end single-page app (React) served from `public/client` in production.
- `public/` — static assets for server UI and for the client bundle.
- `logs/` — runtime logs (managed by `utils/logger.js`).

Refer to `CHANGELOG.md` and `README.md` for product-level info.

---

## High-level architecture

- Node/Express server (in `index.js`) exposes HTTP endpoints for UI and REST admin APIs and serves static assets.
- Socket.IO provides real-time remote keyboard/mouse control and session events. The socket layer uses `authHandler.checkSocketAuth` middleware to map connecting clients to visitor records and session tracking.
- File-based configuration: `auth.config.json` holds visitor records, forbidden lists, authorizations and admin password. `runtime.config.json` holds runtime behaviour (publicDir, safeMode flags, sessionMaxAge, etc.)
- Front-end is a React app (source in `fe/src/`) that calls admin endpoints under `/admin` and interacts with Socket.IO for remote control.

---

## How FSdiscover starts

- Launchers (`fsdiscover.sh` on \*nix and `fsdiscover.cmd` on Windows) change to the app directory and run `node index.js`.
- Launchers support helpers: `--help`, `--logs`, `--config`, `--version`, and `--prefer` to supply a preferred network interface. The scripts also persist `__prefer` and now support `--prefer no-default` to clear it.
- `index.js`:
  - Loads environment, initializes `UseRuntimeConfig`, `UseLogger`, `netprobe` detection and a TUI compositor.
  - Creates an HTTP server and attaches Socket.IO.
  - Applies middleware: cookie parser, CORS, `authHandler.checkAuth`, and other custom middleware.
  - Exposes routes (see next section) and starts listening on a network-detected IP/port.

Important runtime detection notes:

- `netprobe` is used to select a network interface; `--prefer` (from CLI) instructs it to prefer a specific interface.
- Launchers persist `__prefer` when provided and will fall back to the saved value when none is provided on subsequent runs.

---

## Runtime config & initialization flow

- `utils/useRuntimeConfig.js` (`UseRuntimeConfig` / `RuntimeConfig`) loads `runtime.config.json` on startup if present. If not present or invalid, it treats the process as a first launch and opens the initializer UI (`/init`) via `open`/`explorer`.
- A marker file `__init` is created by the server on successful `/init` to indicate initialization has completed. Presence of this file prevents the initializer UI from opening automatically.
- `runtime.config.json` fields (defaultable via `runtime.config.js`) include: `publicDir`, `defaultUploadDir`, `safemodeUploadDir`, `safeMode`, `noAuthFsRead`, `noAuthFsWrite`, `sessionMaxAge`, `apps`, `userspace`, `nodeType`, `autoUpdate`, and `sessionUID`.
- `sessionUID` is regenerated per process startup and used as CSRF-like guard for runtime updates.

Validation of directories

- Both the `/init` endpoint in `utils/handlers.js` and `runtimeConfig.updateConfig` validate any directory paths provided (publicDir, defaultUploadDir, safemodeUploadDir). They return a 400 with newline-separated messages listing missing/invalid paths if validation fails.

### Runtime config properties

Below are the common properties stored in `runtime.config.json` (see `utils/schemas.js` for defaults) and what each controls at runtime.

- `publicDir` (string): Path to the directory exposed by the File Explorer UI. When users browse `/fsexplorer`, files are served from `publicDir` (subject to `noAuthFsRead` and `protectedroutes`). Default: OS home directory.

- `defaultUploadDir` (string): Directory where uploads go by default when a target directory isn't provided or for authenticated uploads. If empty, uploads default to a subpath under `publicDir` (the UI displays the target location).

- `safemodeUploadDir` (string): When `safeMode` is enabled, unauthenticated or public uploads (when permitted) are redirected into this directory. Defaults to the OS `Downloads` folder. Use this to separate public uploads from the general `publicDir` content.

- `noAuthFsRead` (boolean): When true, allows unauthenticated users to read/list files in `publicDir`. When false, read access is restricted to authenticated visitors or authorized tokens. Note: pairing `noAuthFsRead: true` with `safeMode: true` is unusual — `safeMode` assumes you want public uploads without public reads.

- `noAuthFsWrite` (boolean): When true, allows unauthenticated users to upload files. When false, upload endpoints require authentication or an authorization token.

- `safeMode` (boolean): A special mode intended for public-facing deployments where you want to let anonymous users send files but prevent them from listing or reading existing files. When `safeMode` is enabled:
  - Uploads from unauthenticated users are routed to `safemodeUploadDir` instead of the public browseable `publicDir`.
  - File reads are still governed by `noAuthFsRead` — for the classical public-upload-only setup, set `safeMode: true`, `noAuthFsWrite: true`, and `noAuthFsRead: false` so anonymous users may upload but cannot view or download files.

- `autoUpdate` (boolean): Controls whether the application should attempt to perform automatic update steps when an update package is present in the `update/` directory.

- `sessionMaxAge` (number, milliseconds): Cookie/session lifetime used for the `device_name` cookie and for session heuristics. Frontend presents a value+unit UI (seconds/minutes/hours/days) and the server stores milliseconds.

- `userspace` (string): A label describing how this instance is used (examples: `individual`, `organization`, `public_space`). This is mostly informational and may be surfaced in the UI.

- `nodeType` (string): `parent` or `child` — reserved for multi-node/topology behaviours; default is `child`.

- `apps` (array of strings): A whitelist of app routes or external URLs shown in the UI. Defaults include `/fsexplorer`, `/touchpad`, etc.

- `sessionUID` (string, runtime only): A process-scoped random UUID generated on startup. It is required by runtime update requests (the admin UI includes it when submitting config changes) to mitigate stale-client or CSRF-style attempts to change runtime config.

Examples for a public upload-only setup:

1. Allow anonymous uploads but prevent listing/downloads:

{
"safeMode": true,
"noAuthFsWrite": true,
"noAuthFsRead": false,
"safemodeUploadDir": "/home/user/Uploads/public_incoming"
}

Behavior: anonymous users can POST to `/fs/upload` and their files are placed in `/home/user/Uploads/public_incoming`; they cannot list or download files from `/fsexplorer`.

2. Allow authenticated users to browse and upload, anonymous users cannot:

{
"safeMode": false,
"noAuthFsWrite": false,
"noAuthFsRead": false
}

Behavior: browsing and uploading require authentication (tokens or login); no public access.

---

## Authentication, visitors & sessions

- Auth state is persisted in `auth.config.json` managed by `utils/handlers.js` (`AuthHandler`). On first run, a default file is created.
- `AuthHandler.config` contains:
  - `password` — admin password (empty means no admin authentication enforced).
  - `visitors` — array of visitor/session info records (agent, addr, deviceName, uuid, socketid, date, lastAccess).
  - `authorizations` — token-based authorizations, used for socket and REST auth.
  - `forbidden` and `protectedroutes` — admin-managed filters.

Cookie & device name behaviour

- `checkAuth` middleware ensures every REST visitor receives a `device_name` cookie (unless already present). It uses `runtimeConfig.config.sessionMaxAge` as cookie `maxAge` when valid, otherwise falls back to 1 hour.
- Visitors are discovered/created by matching `user-agent` + remote address. For sockets, cookies are parsed from the handshake header and mapped to visitors. When new visitors connect, they are appended to `config.visitors` and persisted via `saveConfig()`.

Sessions

- `UseRuntimeConfig` maintains `sessions` (connectSession, disconnectSession, updateSession) and emits `sessionEvent` over socket.io to update admin UI.

Admin actions for visitors/devices

- Admin router exposes endpoints under `/admin/rq/*` (see Admin API below) including POST `/admin/rq/visitors/rem` to eject visitors (removes matching visitor records by deviceName, uuid/socketid or agent+addr).

## Security

This section describes FSdiscover's security and access-control features, how authentication works, and the admin controls exposed in the System Admin UI (`SysAdminIndex`).

- Authentication model:
  - Admin authentication is configured via `auth.config.json`. If `password` is set, admin areas require login.
  - Token-based authorizations live in `auth.config.json` `authorizations` and can be used by API clients or sockets to gain privileged access.
  - Socket connections may supply an authorization token during handshake; if the token matches an `authorizations` entry the socket receives elevated `socket.token` privileges.

- Visitor and session tracking:
  - Visitors are identified by `user-agent` + remote address; socket and REST flows map to the same visitor records where possible.
  - Each visitor record contains `deviceName`, `addr`, `agent`, `uuid`, `socketid`, `date` and `lastAccess`. These are persisted to `auth.config.json`.
  - The server sets a `device_name` cookie for REST clients so visitor identity persists across requests (cookie `maxAge` follows `runtime.config.sessionMaxAge` when valid).

- Forbidding and protection:
  - Admins can add entries to a `forbidden` list (managed via admin endpoints). Forbidden records will block matching visitors by `agent`+`addr` or `deviceName` and cause immediate 403 responses for REST and rejection for sockets.
  - The `protectedroutes` list prevents specific filenames/paths from being listed or accessed through the file explorer; matching paths are filtered from directory listings and access is denied.
  - Runtime config flags `noAuthFsRead` and `noAuthFsWrite` control whether file read/write endpoints require authentication; when false, only authorized tokens or logged-in visitors can use file explorer/upload endpoints.

- Admin controls (`SysAdminIndex` features):
  - Sessions view: live list of connected sessions emitted from `UseRuntimeConfig`. Admins can monitor activities and disconnect sessions via the admin UI.
  - Visitors view: lists persisted visitors with actions to `Eject` (POST `/admin/rq/visitors/rem`) and `Forbid` (adds to `forbidden`). `Pardon` endpoints remove forbidden entries.
  - Runtime config editor: change `publicDir`, upload directories, `safeMode`, `noAuthFsRead`, `noAuthFsWrite`, `sessionMaxAge` (value+unit UI). Updates require the current `sessionUID` to prevent replay/CSRF of runtime updates.
  - Protected routes editor: add/remove route patterns that should be hidden or blocked from file listings.
  - Password management: change admin password via `/admin/rq/change-password`.
  - Logout and token management: revoke authorizations and force logout via `/admin/rq/logout` and managing `authorizations` array.
  - Remote exec: `/admin/rq/exec` allows sending commands to the executor (used with care; only available to logged-in admins).

- Session and cookie security:
  - `sessionMaxAge` controls cookie lifetime and session heuristics; frontend exposes value+unit inputs but the server stores milliseconds.
  - `sessionUID` is regenerated at startup and required for runtime config updates — it serves as a lightweight guard against stale clients attempting to apply config updates.

- Operational notes & hardening suggestions:
  - Keep `password` set to a strong secret to enable admin enforcement.
  - Use `authorizations` tokens for automated clients instead of sharing the admin password.
  - Use `forbidden` entries carefully — they are string-based matches; prefer `deviceName` or `addr` for precision.
  - The server performs basic path checks for file access; do not expose `publicDir` on untrusted networks without additional OS-level protections.

---

## HTTP routes (high-level)

- Public & static
  - `/` and wildcard routes serve front-end UI via `handlers.sendUi`.
  - `/fsexplorer` serves files in `runtime.config.publicDir` with `authHandler.checkDirAuth` guard.

- File transfer
  - POST `/fs/upload` — multipart upload endpoint (uses multer) with `noAuthFsWrite` guard.
  - GET `/fsdownload*` — download single file with content-disposition and path traversal protection.
  - GET `/zipper*` — creates zip stream of a directory.

- Admin & auth
  - GET `/runtime` — returns safe runtime config.
  - POST `/init` — initialization endpoint (only allowed from localhost and only when `firstlaunch` true); validates directories, builds runtime config, writes `__init` marker file.
  - `/admin` router (admin-only via `authHandler.enforceAuth`) exposes multiple RPC endpoints under `/admin/rq/*` (config, runtime update, sessions, devices/rem, visitors/rem, forbidden lists, change-password, logout, protectedroutes, exec).

- Misc
  - GET `/hostname`, GET `/heartbeat`, various TUI support endpoints.

Refer to `utils/adminRouter.js` for the canonical list of admin routes.

---

## Socket handling & remote control

- Socket.IO server is attached to the HTTP server in `index.js`. Important aspects:
  - Socket middleware `authHandler.checkSocketAuth` maps the connecting socket to a `visitor` record and attaches `socket.user` and `socket.token`.
  - Connection event constructs `Mouse` and `Keyboard` handlers from `utils/devices.js` passing `handlers` and `authHandler` for device parsing and event routing.
  - Socket events handled: `activities`, `pointerEvent`, `middleclick`, `keydown`, `keyup`, `keypress`, `keytype` — these are forwarded to keyboard/mouse device handlers which perform OS actions.
  - Disconnection cleans up device state and notifies `runtimeConfig.disconnectSession`.

Security notes:

- The socket handshake accepts a `token` field (authorization) — if provided and matches an entry in `auth.config.json` `authorizations`, the socket receives that token as `socket.token` enabling privileged actions.

---

## File-system operations

- `utils/handlers.js` implements filesystem explorers using platform commands (`ls`, `dir`) and shells out for delete operations. It includes careful path normalization and basic path traversal prevention checks (normalization and forbids `..`).
- Uploads are staged in `temp/` and then moved into the appropriate `defaultUploadDir` or `safemodeUploadDir` depending on `safeMode` and `noAuthFsWrite`.

---

## Utilities — notable modules

- `utils/logger.js` — central logger that writes runtime logs to `logs/` and emits `netlog` io events. It keeps up to ~20 logs in the directory and prunes as needed.
- `utils/useRuntimeConfig.js` — manages runtime config, sessions, validation and sessionUID guard. It also triggers opening `/init` if needed and writes `runtime.config.json` on save.
- `utils/handlers.js` — large file implementing auth, file handlers, zip/directory listings, init endpoint, and many helper functions for cross-platform FS operations.
- `utils/adminRouter.js` — wiring for admin routes to methods on `authHandler` and `runtimeConfig`.
- `utils/devices.js` — device-specific logic for mouse/keyboard remote control (not expanded here; see file for implementation details).

---

## Frontend (`fe/`) structure

- `fe/src/` is a React app with the following high-level structure:
  - `App.jsx`, `main.jsx` — bootstrapping and routing.
  - `pages/` — screens: `Init.jsx` (initializer), `SysAdminIndex.jsx` (admin UI), `AdminIndex.jsx`, `Admin.jsx`, `SafeMode.jsx`, `NotFound.jsx`.
  - `apps/` — applets (file manager, device manager, touchpad) used in the UI.
  - `state/` — React contexts: `FsContext`, `InputContext`, `StateContext`.
  - `assets/` and `components/` — UI building blocks.

Key front-end behaviours implemented:

- Admin UI calls `/admin/rq/*` endpoints to fetch and mutate runtime config, sessions, forbidden lists and visitors.
- `Init.jsx` uses a value + unit input for `sessionMaxAge` and converts it to milliseconds for the `/init` POST (session value/unit UI consistent with admin runtime edit).
- `SysAdminIndex.jsx` contains management UI for visitors and sessions and includes an `Eject` action that calls `/admin/rq/visitors/rem` to remove visitor records from `auth.config.json`.

---

## Launcher scripts and `__prefer`

- `fsdiscover.sh` and `fsdiscover.cmd` accept `--prefer <iface>` (or `-p <iface>`) to persist a preferred network interface in a file called `__prefer` in the application directory.
- If `--prefer no-default` is passed, the scripts delete `__prefer` to clear persisted preference.
- If no `--prefer` is supplied, the launchers read `__prefer` (if present) and pass `--prefer <iface>` to `node index.js` so `netprobe` will prefer that interface.

---

## Important files (quick reference)

- `index.js` — app entrypoint. Responsible for starting HTTP+Socket servers, netprobe, TUI, and wiring all middleware and routes.
- `utils/handlers.js` — contains `Handlers`, `Middleware`, and `AuthHandler` with methods: `init`, `checkAuth`, `checkSocketAuth`, `getPath`, `downloadFile`, `zipDir`, `deletePath`, etc.
- `utils/useRuntimeConfig.js` — `RuntimeConfig` and `UseRuntimeConfig` for sessions and runtime config.
- `utils/adminRouter.js` — router mapping to admin RPC endpoints.
- `utils/logger.js` — logging and socket netlog emitter.
- `fe/src/pages/Init.jsx` — initializer UI.
- `fe/src/pages/SysAdminIndex.jsx` — system admin UI and visitor management.
- `fsdiscover.sh`, `fsdiscover.cmd` — launchers with `__prefer` handling.

---

## Troubleshooting & behaviour notes

- If the initializer keeps opening on startup, ensure `__init` is present in the app directory. The server writes it after a successful POST `/init`.
- If runtime updates fail with directory validation errors, the server will respond with 400 and newline-separated human-readable messages identifying missing or invalid directories.
- Cookie persistence: the server sets `device_name` cookie with `maxAge` taken from `runtimeConfig.config.sessionMaxAge` (fallback 1 hour) and `sameSite: 'lax'` to allow modern browser persistence.
- If sockets are not receiving cookies, ensure Socket.IO clients include cookies on connect (the server reads raw cookie header in the handshake).

---

## How to extend documentation further

This DOCS.md targets the code paths and files most relevant to runtime behaviour, admin operations, and front-end integration. To reach "every nuke and cranny" level, the following expansions are recommended:

- Automatic per-file summaries: iterate over `utils/*` and `fe/src/**/*` and extract exported functions, public methods and inline comments (I can produce this on request).
- Document `utils/devices.js` in depth (mouse & keyboard handlers), listing supported events and behavior on each platform.
- Add sequence diagrams for: initialization sequence, socket connect/auth flow, upload flow, and admin runtime update flow.

If you want, I can now generate a per-file section for every file in the repository (long output) and insert it in `DOCS.md` — confirm and I will proceed.

---

Generated: 2026-06-11
