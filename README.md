# FSdiscover
 
## Overview
 
**FSdiscover** (File System Discover) is a lightweight, cross-platform tool for **file sharing and remote control over a local network**. It lets any device on the same network send and receive files directly to and from the host computer, no internet, no cloud setup, no extra apps.
 
It also exposes a browser-based remote control interface for keyboard and mouse input, useful for presentations or day-to-day desktop access from a phone or tablet.
 
FSdiscover runs on Linux, Windows, and macOS. Clients connect through a browser using a local network URL that appears on launch.
 
---
 
## Features
 
- **Fast File Transfer**: Transfer files between devices over LAN at up to 22 Mbps on mobile Wi-Fi and over 100 Mbps on wired connections.
- **No Cloud Required**: Everything happens on your local network. No account, no upload to a third-party server.
- **Remote Keyboard & Mouse**: Control your computer from a browser touchpad, keyboard, and scroll all work.
- **Presentation Remote**: A dedicated mode for running presentations remotely.
- **Virtual Keypad**: On-screen keyboard for remote text input.
- **Custom App-Level Firewall**: Control which devices can connect and what they can access.
- **Cross-Platform**: Works on Linux, Windows, and macOS. Any device with a browser can connect no client installation needed.
- **Automatic Updates**: FSdiscover keeps itself up to date.
- **CLI & Desktop Integration**: Launch via terminal (`fsdiscover`) or a desktop shortcut.
- **Interactive Tour Guide**: Built-in walkthrough to get you up to speed quickly.
---
 
## How It Works
 
FSdiscover runs a local web server on top of **Node.js**. On launch, it detects the best available network interface wired, Wi-Fi, or hotspot and prints a local URL. Any device on the same network can open that URL in a browser to start transferring files or controlling the host.
 
File transfers are handled through a browser-based file explorer. Remote control uses **WebSockets** for low-latency keyboard and mouse input. All activity is logged, and log files are automatically rotated when they exceed a set size.
 
## Installation

### Quick Start (GUI/Desktop)

1. Download the installer for your OS (Windows, Linux, or macOS).
2. Run the installer FSdiscover sets up a desktop shortcut automatically.
3. Launch FSdiscover a local network link will appear.
4. Open the link on any device on the same network to start transferring files or controlling the computer.

### Advanced / CLI Installation

### Linux & macOS
```bash
curl -s https://fsdiscover.sprintet.com/downloads/fsdiscover-netinstall.sh | bash
```
or
```bash
git clone https://github.com/msugh623/fsdiscover.git
cd fsdiscover
./install.sh
```

### Windows
```CMD
curl -s https://fsdiscover.sprintet.com/downloads/fsdiscover-windows-netinstall.cmd -o fsdiscover-install.cmd && fsdiscover-install.cmd
```
or
```CMD
git clone https://github.com/msugh623/fsdiscover.git
cd fsdiscover
install.cmd
```

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

Questions, issues, or ideas? Contact us at **team@sprintet.com**

View on GitHub: https://github.com/msugh623/fsdiscover

See more on the website https://fsdiscover.sprintet.com/

© 2025 SprintET. All rights reserved.
