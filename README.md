# FSdiscover

## Overview

**FSdiscover** (File System Discover) is a **lightweight, cross-platform tool for secure file transfer, remote control, and mini personal cloud storage**. Its primary function is to let users **send files to and receive files from their computer remotely**, effectively turning the host device into a personal cloud. FSdiscover works on any device on the same network, requiring no cloud setup or extra installations.

FSdiscover also provides **remote control functionality**, ideal for presentations, demos, or everyday use. You can interact with your computer's keyboard and mouse remotely from a browser on a phone, tablet, or another PC.

FSdiscover is designed for everyone — casual users, students, and professionals alike — providing a **fast, secure, and hassle-free experience**. It runs on Linux, Windows, and macOS, and launches through a browser-accessible local URL.

---

## Features

- **Ultra-Fast File Transfer**: Upload or download files directly between devices over the network at speeds over to 22 Mbps (mobile wi-fi) and over 100 Mbps on LAN.
- **Mini Personal Cloud**: Use the host computer as a personal cloud for easy access to your files from other devices.
- **No Arbitrary Move/Copy**: Files cannot be moved or copied between devices outside of the upload/download process, ensuring security.
- **Remote Keyboard & Mouse**: Control your computer remotely for presentations or daily use with responsive keyboard and touchpad inputs.
- **Presentation Remote**: Dedicated mode optimized for giving presentations seamlessly.
- **Virtual Keypad**: Type remotely using an on-screen keyboard.
- **Interactive Tour Guide**: Familiarize yourself quickly with all features.
- **Custom App-Level Firewall**: Control who can connect, set rules, and forbid access to unwanted users.
- **Cross-Platform**: Works out-of-the-box on Linux, Windows, and macOS. Clients connect via browser — no extra apps needed.
- **Automatic Updates**: FSdiscover manages its own updates to ensure you always have the latest features.
- **CLI & Desktop Integration**: Launch via terminal (`fsdiscover`) or desktop launcher.

---

## How It Works

FSdiscover runs on top of **Node.js**, spinning up a local web server on launch. It detects the best network interface (wired, Wi-Fi, or hotspot) and exposes a browser-accessible URL. Any device on the same network can access the host computer using this link.

**File Transfer** is handled via a browser-based file explorer, allowing uploads and downloads to/from the host device's broadcast or home directory. Remote control uses **WebSockets** for smooth, stateful keyboard and mouse interactions.

FSdiscover logs all activity to ensure transparency and automatically manages log file storage by deleting old entries when necessary.

---

## Installation

### Quick Start (GUI/Desktop)

1. Download the installer for your OS (Windows, Linux, or macOS).
2. Run the installer — FSdiscover sets up a desktop shortcut automatically.
3. Launch FSdiscover — a local network link will appear.
4. Open the link on any device on the same network to start transferring files or controlling the computer.

### Advanced / CLI Installation

#### Linux & macOS

````bash
git clone https://github.com/msugh623/fsdiscover.git
cd fsdiscover
./install.sh
# or headless install
curl https://sprintet.onrender.com/apps/fsdiscover/fsdiscover-netinstall.sh | bash

### Windows

```cmd
git clone https://github.com/msugh623/fsdiscover.git
cd fsdiscover
install.cmd
````

---

## Usage

To start FSdiscover:

```bash
fsdiscover
```

To uninstall FSdiscover:

```bash
fsdiscover -u
# or
fsdiscover --uninstall
```

To view available options:

```bash
fsdiscover -h
# or
fsdiscover --help
```

---

## Security

FSdiscover includes a custom app-level firewall to control connections, manage users, and secure directories. Access can be restricted, connections forbidden, and all activity is logged. File transfers are stream-based, with a maximum transfer size of 100GB per session.

## FAQ

Do both devices need to be online?
Yes, but only on the same network or reachable via the required port. No internet is required for LAN use.

Is there a limit to the file size?
Yes, file transfers are stream-based and limited to 100GB per session.

Do I need to open ports manually?
Usually not. FSdiscover auto-discovers devices on the same LAN.

## Contributing

We welcome your contributions! Here’s how you can help:

1. Fork the repository.
2. Create a new branch for your changes.
3. Commit and push your changes to your fork.
4. Submit a pull request with a clear description of your changes.

---

## Contact

Questions, issues, or ideas? Contact us at **sprintetmail@gmail.com**

View on GitHub: https://github.com/msugh623/fsdiscover

See more on the website https://sprintet.onrender.com/apps/fsdiscover

© 2025 SprintET. All rights reserved.
