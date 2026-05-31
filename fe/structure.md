# Frontend structure and flow

This document describes the `fe/` directory tree and a concise structural flow diagram for the frontend React application.

## Simplified directory tree

fe/
├─ axios/
│ └─ api.js
├─ public/
│ ├─ manifest.json
│ ├─ bg.jpg
│ ├─ icon.png
│ └─ (images & static assets)
├─ src/
│ ├─ App.jsx
│ ├─ main.jsx
│ ├─ Layout.jsx
│ ├─ css/
│ │ ├─ index.css
│ │ └─ cse.css
│ ├─ assets/
│ │ ├─ actions.js
│ │ ├─ keymap.js
│ │ └─ schemas.js
│ ├─ state/
│ │ ├─ FsContext.jsx
│ │ ├─ InputContext.jsx
│ │ └─ StateContext.jsx
│ ├─ components/
│ │ ├─ Background.jsx
│ │ ├─ Clock.jsx
│ │ ├─ Delay.jsx
│ │ ├─ Loader.jsx
│ │ ├─ Menu.jsx
│ │ ├─ Opened.jsx
│ │ ├─ PinnedIcons.jsx
│ │ ├─ PlaceHolder.jsx
│ │ ├─ TaskBar.jsx
│ │ └─ Window.jsx
│ ├─ apps/
│ │ ├─ deviceManager/
│ │ │ ├─ ConnectedDevices.jsx
│ │ │ ├─ ConnectedDevice.jsx
│ │ │ └─ components/
│ │ │ ├─ DeviceHeader.jsx
│ │ │ └─ MainHeader.jsx
│ │ ├─ fsmanager/
│ │ │ ├─ FileManager.jsx
│ │ │ ├─ MainSection.jsx
│ │ │ └─ components/
│ │ │ ├─ Header.jsx
│ │ │ ├─ Sidebar.jsx
│ │ │ ├─ File.jsx
│ │ │ ├─ DirItem.jsx
│ │ │ └─ Folder.jsx
│ │ └─ touchpad/
│ │ ├─ Index.jsx
│ │ └─ components/
│ │ ├─ Controller.jsx
│ │ ├─ Panel.jsx
│ │ └─ KeyboardFocusable.jsx
│ └─ pages/
│ ├─ About.jsx
│ ├─ Admin.jsx
│ ├─ AdminIndex.jsx
│ ├─ AddApp.jsx
│ ├─ Contact.jsx
│ ├─ Init.jsx
│ ├─ SysAdminIndex.jsx
│ └─ authPages/
│ └─ Login.jsx
├─ vite.config.js
├─ package.json
└─ README.md

## High-level structural flow

- App bootstrap: `src/main.jsx` mounts React and providers.
- Routing & shell: `src/App.jsx` + `src/Layout.jsx` compose the shell UI and route pages.
- Global contexts: `StateContext` (UI/windows), `InputContext` (focus/input), `FsContext` (filesystem API layer).
- API layer: `axios/api.js` centralizes backend calls (e.g., `/runtime`, `/isfirstlaunch`, file operations).

User action example — open File Manager:

1. User clicks an icon in `PinnedIcons` or a menu entry in `TaskBar`.
2. `StateContext` updates active window or router navigates to `FileManager` route.
3. `FileManager` requests folder data via `FsContext` → `axios/api.js` → backend.
4. `File`, `DirItem`, and `Folder` components render results.

Component responsibilities

- `TaskBar.jsx`: launches apps, shows pinned items.
- `Window.jsx`: generic app container (titlebar + controls + content).
- `PinnedIcons.jsx`: draggable icons that open apps.
- App components under `apps/*` implement domain-specific UI.

Styling

- Tailwind utilities and overrides live in `src/css/index.css`.

Developer notes

- For UI-only changes, edit files under `src/pages`, `src/components`, or `src/apps/*/components`.
- To trace runtime values, inspect `StateContext.jsx`, `FsContext.jsx`, and `axios/api.js`.
- If you want links to specific files/lines, I can add them (e.g., `[src/Layout.jsx](src/Layout.jsx#L1)`).

---

Generated on 29 May 2026.
