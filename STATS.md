# fsdiscover stats and app state model

This project has two related layers:

1. A small telemetry system that reports install/update/check-update events.
2. A set of persisted and React state stores that drive the desktop-like UI, file manager, runtime config, and session tracking.

---

## 1) The stats system

### Entry points

The telemetry flow is split into tiny scripts under the root `stats/` folder:

- `stats/send_stat.js` — actual HTTP sender
- `stats/install_logstat.js` — emits install event
- `stats/checkupdate_logstat.js` — emits check-update event
- `stats/update_logstat.js` — emits update event

The shared payload definition lives in `utils/schemas.js`.

### Core payload schema

`createStat(stat_type)` builds a payload like this:

```js
{
  version: "...",
  osVersion: "...",
  platform: "darwin|win32|linux",
  datetime: "2026-10-01T12:34:56.789Z",
  stat_type: "install | checkupdate | update",
  region: "America/New_York",
  arch: "x64",
  dID: "device UUID or empty string"
}
```

The relevant enums are:

```js
const statTypes = Object.freeze({
  INSTALL: "install",
  UPDATE: "update",
  CHECK_UPDATE: "checkupdate",
});
```

### What gets sent

`send_stat.js` does this:

```js
await axios.post("https://sprintet.com/rq/fsdiscover/stats", createStat(statType), {
  timeout: 5000,
  headers: { "content-type": "application/json" },
});
```

The `catch` block intentionally swallows every network failure:

```js
catch {
  // Telemetry must never affect installation, updates, or startup.
}
```

That means the stats system is intentionally best-effort telemetry. It should never block startup, install, or update flow.

### How the updater triggers stats

`update.js` is the real trigger point. It starts a background process via `spawn(process.execPath, [path.join(dirname(), "stats", script)])` and then immediately unrefs it so it can run without holding up the parent process.

The flow is:

1. `update.js` checks `runtimeConfig.config.autoUpdate`.
2. If enabled, it fires `checkupdate_logstat.js` in background.
3. It compares local `version` vs GitHub remote `version`.
4. If an update is available, it fires `update_logstat.js` before downloading/extracting the new build.
5. The whole thing keeps going without blocking the current session.

So the telemetry system is basically a sidecar process that sends anonymous machine metadata while the app updates itself.

---

## 2) Runtime config/state structure

The main persisted runtime object is built from `utils/schemas.js` and loaded by `utils/useRuntimeConfig.js`.

### Default runtime config

```js
const runtimeConfData = {
  publicDir: String(os.homedir()),
  defaultUploadDir: String(""),
  noAuthFsRead: true,
  noAuthFsWrite: true,
  safemodeUploadDir: String(os.homedir() + "/Downloads"),
  deviceID: "",
  autoUpdate: true,
  sessionMaxAge: 60 * 60 * 1000,
  userspace: "individual",
  safeMode: false,
  nodeType: "child",
  apps: [
    "https://sprintet.onrender.com/fsdiscover",
    "/fsexplorer",
    "/touchpad",
    "/os",
    "/devices",
  ],
};
```

The runtime config is stored in `runtime.config.json` and merged on startup:

```js
this.config = { ...conf, ...toJson };
```

Then `UseRuntimeConfig` ensures `sessionUID` exists and generates a `deviceID` if missing:

```js
this.config.sessionUID = crypto.randomUUID();
if (!this.config.deviceID) {
  this.config.deviceID = crypto.randomUUID();
  this.saveConfig();
}
```

### Why this matters

`deviceID` feeds the telemetry `dID`, while the runtime config also controls:

- file manager directory defaults
- read/write safety flags
- safe mode state
- auto-update behavior
- app routes available for the UI
- session expiry age

### Session tracking

`RuntimeConfig` also keeps an in-memory `sessions` array. The methods are:

- `connectSession(user)`
- `disconnectSession(user)`
- `updateSession(user)`
- `getSessions(_, res)`

The session objects are not strictly defined in a schema file; they are dynamic user/session objects coming from sockets and auth layer. The code uses matching keys like:

```js
u.addr + u.agent + u?.uuid + u?.socketid
```

to identify a session and update or replace the existing entry without duplicating rows.

This is the server-side state that powers the session list used in the UI via `socket.on("sessionEvent", ...)`.

---

## 3) Neighborhood state

The neighborhood config is defined by `config/neighborhood.config.js` and mirrors `utils/schemas.js`’s `neighborhoodData` shape:

```js
const neighborhoodData = {
  discovered: [],
  pairing: [],
  pairRequests: [],
  paired: [],
};
```

This is the state container for local network/device discovery and pairing flows. It is a separate persisted config from runtime config and is not part of the stats telemetry itself, but it is a core state store in the project.

---

## 4) Frontend React state structure

The main app state is built in `fe/src/state/StateContext.jsx`.

### StateContext core values

This provider tracks the outer desktop-shell state:

```js
const [apps, setApps] = useState([...defaultApps]);
const [opened, setOpened] = useState([]);
const [categories, setCategories] = useState([]);
const [winIsFs, setWinIsFs] = useState(false);
const [fetching, setFetching] = useState(false);
const [pop, setPop] = useState("");
const [vw, setVw] = useState(window.innerWidth);
const [hostname, setHostname] = useState("");
const [forbidden, setForbidden] = useState([]);
const [visitors, setVisitors] = useState([]);
const [protectedRoutes, setProtectedRoutes] = useState([]);
const [password, setPassword] = useState("");
const [devices, setDevices] = useState([]);
const [traffic, setTraffic] = useState([]);
const [runtimeConfig, setRuntimeConfig] = useState({});
const [safeMode, setSafeMode] = useState(null);
const [profile, setProfile] = useState({});
const [scrollConfig, setScrollConfig] = useState({
  top: scrollY,
  height: document.documentElement.scrollHeight,
});
const [menuPos, setMenuPos] = useState({
  x: 40,
  y: window.innerHeight - 100,
});
const [key, setKey] = useState("");
const [sessions, setSessions] = useState([]);
```

### Opened windows / app state shape

`openApp(loc, href = "")` creates a window object like:

```js
{
  ...app,
  width: window.innerWidth,
  height: window.innerHeight,
  x: 0,
  y: 0,
  isMini: false,
  zIndex: 3,
  id: String(Date.now()),
  href: href || "",
}
```

These are stored in the `opened` array and drive the floating-window UI.

The app-level data includes app metadata such as:

```js
{
  name: "Files",
  location: "/fsexplorer",
  icon: "/icon.png",
  pinned: true,
  about: "SprintET File Explorer",
  category: "utility"
}
```

### Socket-driven state

A single socket instance is created once:

```js
const socket = io(baseUrl, {
  auth: { token: localStorage.access || "" },
  autoConnect: true,
});
```

This socket is exposed to the app and used for:

- `netlog` events
- `sessionEvent` events
- per-client `exec-<socket.id>` actions
- `activities` updates whenever the window set changes

### App bootstrap behavior

On mount, the provider does several things:

- loads safe mode state from `/safemode`
- fetches `/hostname`, `/profile`, and `/runtime`
- fills `apps`, `runtimeConfig`, `hostname`, `profile`
- listens for `sessionEvent`
- calls `socket.emit("getSessions")` if user is logged in
- stores scroll state and window event handlers

This means the root app state is a mix of:

- config from the backend
- session/activity events from sockets
- local UI state in React

---

## 5) File-system state

The file manager state is isolated in `fe/src/state/FsContext.jsx`.

```js
const [locPath, setLocPath] = useState("");
const [locChildren, setLocChildren] = useState([]);
const [isFetching, setIsFetching] = useState(false);
const [isHidden, setIsHidden] = useState(false);
const [key, setKey] = useState("");
const [err, setErr] = useState("");
const [title, setTitle] = useState("");
const [modal, setModal] = useState("");
```

`getFs(path)` calls:

```js
const res = await api.get("/fs" + path);
setLocChildren(res.data);
```

And the provider watches route changes, so the file tree follows the current browser path under `/fsexplorer`.

This is intentionally separate from the global desktop state because the file tree is a feature-specific state machine with status, error, and listing data.

---

## 6) Input/touchpad state

The touchpad/remote-input state lives in `fe/src/state/InputContext.jsx`.

### Main config shape

```js
const [touchConfig, setTouchConfig] = useState({
  dispX: 0,
  dispY: 0,
  lastX: 0,
  lastY: 0,
  mouseX: 0,
  mouseY: 0,
  lastMouseDownX: 0,
  lastMouseDownY: 0,
  lastMouseUpX: 0,
  lastMouseUpY: 0,
  mouseDown: false,
  mouseAlt: false,
  ready: false,
  click: false,
  mouseDownHold: false,
  mouseDownHoldExt: false,
  mouseIsMoving: false,
  scrollX: 0,
  scrollY: 0,
  scrollPointX: 0,
  scrollPointY: 0,
  scrollDown: false,
  hasKeyboard: false,
});
```

It tracks pointer movement, pressed keys, scroll state, click type, and device activity. The logic uses drag/move detection and stale-timer checks to decide if a mouse press was a drag or a hold.

It also keeps:

```js
const [downKeys, setDownKeys] = useState([]);
const [keyVal, setKeyVal] = useState("");
const [badKey, setBadKey] = useState(false);
const [status, setStatus] = useState("");
const [err, setErr] = useState("");
```

This is the state that turns browser input into host-machine actions over the socket connection.

---

## 7) Big picture

The project uses a layered state model:

- `runtime.config.json` and `UseRuntimeConfig` = persisted machine config + sessions
- `config/neighborhood.config.js` = local discovery/pairing state
- `StateContext` = app shell, opened windows, permissions, auth/admin state
- `FsContext` = file explorer-specific path/list state
- `InputContext` = remote touchpad/mouse/keyboard state
- `stats/*` = fire-and-forget telemetry for install/update/check-update events

They are intentionally separate because each one has a different lifecycle:

- telemetry is side-effect-only and should never break the app
- runtime config is persistent machine state
- window/session state is UX/session state
- file-system state is route-driven feature state
- input state is real-time event state

---

## 8) Quick mental model

Think of the app like this:

```text
stats scripts -> send anonymous machine metadata
      |
      v
runtime config -> defines defaults, safe mode, app list, session max age
      |
      v
socket/session layer -> tracks connected clients and active sessions
      |
      v
React context providers -> render desktop, file system, touchpad behavior
```

That is the core state architecture in this repo.
