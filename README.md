# ⛏️ PaperCreeper Panel

The ultimate, lightweight, AI-powered control panel for Minecraft Servers. Optimized for **Linux VPS**, **Bare Metal**, and containerized environments.

![PaperCreeper Panel](https://img.shields.io/badge/Minecraft-PaperMC-emerald.svg) ![Node.js](https://img.shields.io/badge/Node.js-21+-blue.svg) ![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20Windows-lightgrey.svg)

## ✨ Core Features

- **Built-in AI Assistant & AI Engine:** Diagnoses Java errors in real-time, writes configurations, auto-fixes issues, and can even write `.sk` scripts (Skript) out-of-the-box to add live game elements instantly.
- **Auto-Optimized "Aikar's Flags":** Built-in automatic deployment of extreme-performance GC cycle parameters when you use Paper, Forge, or Purpur.
- **Plugin/Mod Smart Installer:** Searches Modrinth and Hangar for plugins/mods. Automatically places downloads into `/plugins` or `/mods` depending on the selected server engine (Fabric/Forge vs Paper/Spigot).
- **Playit.gg Zero-Config Tunneling:** No port forwarding required. Creates global access IPs in one click.
- **Robust Dependency Handling**: Automatically downloads and maps Java 21, Skript engine, and other background tools securely without system clutter.

## 🚀 Installation & Deployment

### Method A: Fully Automated VPS/Linux (Recommended)

To install on a clean Ubuntu/Debian server or container:

```bash
# 1. Update and install basic dependencies
sudo apt update && sudo apt install -y curl git nodejs npm

# 2. Clone the Repository
git clone https://github.com/wadsonbarcellos-dev/PAPERCREEPER.git
cd PAPERCREEPER

# 3. Setup Project
chmod +x setup.sh && ./setup.sh

# 4. Start (Production Mode)
npm run build
npm start
```
The panel will securely expose itself on port **3000** (e.g., `http://YOUR_SERVER_IP:3000`).

### Method B: GitHub Codespaces (For Developers & Testing)
1. Go to your GitHub repository and click **Code** > **Codespaces** > **Create Codespace**.
2. It will automatically install `Java 21`, download dependencies, and spin up.
3. Access the web interface on the forwarded port 3000.

### Method C: Desktop App (Windows)
Want a native desktop panel to run your friends' localhost server?
```bash
npm install
npm run dist:win
```
Wait for the electron builder to finish. Your `.exe` file will be generated in `dist-desktop/`.

### Method D: Android & iOS (Mobile Devices)

Yes, you can run PaperCreeper and your Minecraft Server directly from your smartphone!

**On Android:**
1. Install **Termux** from F-Droid (do not use the Google Play version, it is outdated).
2. Open Termux and run:
   ```bash
   pkg update && pkg upgrade
   pkg install python git nodejs openjdk-17 -y
   ```
3. Clone the panel and install dependencies:
   ```bash
   git clone https://github.com/wadsonbarcellos/papercreeper.git
   cd papercreeper
   npm install && npm run build
   npm run start
   ```
4. Access `http://localhost:3000` directly in your phone's browser, or from another device on the same Wi-Fi using your phone's local IP!
*(Note: Android aggressively kills background apps. Keep Termux open, disable battery optimization for it, and use server software like Paper or Purpur for optimal performance on ARM CPUs. Also note that your phone's processor and RAM will be heavily tested!)*

**On iOS:**
Running full-scale Node.js and Java servers isn't natively supported on iOS due to Apple's sandbox restrictions.
- You can use apps like **iSH Shell** (a Linux emulator), but performance will be severely degraded (too slow for a playable server).
- Jailbroken devices or using virtual machines (like UTM) can run Linux, but it's not recommended for production servers.
- The best way to use iOS is as a remote management tool: access your VPS-hosted PaperCreeper panel from your iPhone's Safari browser. The panel is 100% responsive!

## ⚡ Our Ultimate Power & Capabilities

PaperCreeper is not just a dashboard; it's a fully integrated ecosystem designed to give you superpower-like control over your server environment:

- **AI-Powered Diagnostics:** The integrated AI constantly analyzes stack traces, error codes, and server lag spikes behind the scenes, giving you instant, actionable fixes directly in the console. It even generates complete Skript (.sk) code in real-time.
- **Integrated Web Ecosystem:** Spin up an instant site/store that seamlessly syncs with your server. Features multi-language support (English/Portuguese), family-friendly toggles, and performance modes to guarantee it runs everywhere smoothly.
- **Universal Cross-Platform Agility:** Runs on High-End bare metal Linux, Windows Desktop, inside GitHub Codespaces, and even a spare Android phone. 
- **Zero-Friction Tunneling:** We bypassed NAT and CGNAT restrictions. Our one-click Playit.gg integration creates a public `auto-named.playit.gg` IP without ever touching your router settings.
- **Containerization & Auto-Downloads:** No more manual Java version matching. The panel pulls the EXACT binaries (Java 17, Java 21, Paper, Fabric, Forge) into sandboxed directories to keep your system perfectly clean.
- **Dynamic Module Management:** Native, lightweight APIs index the latest plugins from Modrinth and Hangar, deploying them instantly based on your exact server software.

### 🛒 Auto-Generated Websites & In-Game Stores
Instantly spin up a beautifully designed, lightweight web application for your server out of the box! Without needing external websites like Tebex, you can configure VIP Ranks, Items, and Perks inside PaperCreeper. The system automatically creates a responsive HTML site using TailwindCSS natively in Node.js, and directly parses the purchases into live server commands instantly when the transaction is made. It's the simplest way to monetize or manage custom server interactions!

### 📡 Dynamic Metadata Framework
Due to constantly changing APIs, PaperCreeper integrates a *Real-Time Metadata Engine*. Instead of relying on hardcoded link strings that die out after a month, the panel leverages endpoints like `/api/meta` to index Mojang, PaperMC, Fabric, and Forge API manifests live. Ensure your server firewall allows outbound connections to `api.papermc.io` and `meta.fabricmc.net`!

### 🔌 Intelligent Plugins & Mods Installer
We've abstracted away downloading and FTP dragging.
- Using our Universal Plugin search, you can install out of **Modrinth** & **Hangar** seamlessly. 
- Using Spigot/Paper/Purpur? It gets downloaded to `/plugins`.
- Using Forge/Fabric? It goes automatically to `/mods`.

### 🛡 Playit.gg Tunnels & Dedicated VPS IPs
We support **Per-Server Tunnels**. You can have multiple Minecraft servers running simultaneously on different ports within PaperCreeper, each bridging to their own unique `playit.gg` global IP.
**VPS Users:** If your host machine has a dedicated IPv4 address, you can toggle **"Túnel Playit.gg (Público)" OFF** inside the "Create Server" modal to maximize direct connection performance natively on standard ports.

### ❓ Troubleshooting
- **Problem:** "Download of Paper/Purpur fails or returns 0 bytes".
  **Solution:** Ensure you are not being rate-limited by `api.papermc.io` or that your DNS isn't blocking `.jar` extensions.
- **Problem:** "Java Runtime not found / Could not boot the jar". 
  **Solution:** The panel automatically downloads the Adoptium JRE 21. If it gets corrupted, simply delete `bin/java_runtime` and restart the panel.
- **Problem:** "AI Assistant does not answer or gives 'API Key' error".
  **Solution:** Click the AI icon (or Settings) in the panel and input a valid Google Gemini API Key (`AIza...`).

## 🧠 AI Real-Time Agent

Whenever your server starts, the **PaperCreeper AI Agent** listens silently to the server console output in the background. If an `Exception`, `WARN`, or `Crash` occurs, the AI analyzes the stack trace instantly in the background and suggests concise solutions right into your server terminal view. No more copy-pasting code into ChatGPT.

## 📄 License & Credits
Developed passionately for the community. Always lightweight, always open.

> "A next-generation abstraction over tedious command-line setups" — *The PaperCreeper philosophy.*
