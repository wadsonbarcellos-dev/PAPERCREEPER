# PaperCreeper - The Magic Minecraft Panel (AI + Skript + Local Servers)

**PaperCreeper** is not just a hosting panel. It is your Minecraft companion built with Artificial Intelligence and extreme focus on performance.  
Create servers (Paper, Forge, Fabric, etc.), manage plugins, edit maps, modify settings, inject Native Magic Skripts, and export your game world in minutes, all with the help of our "Creeper Intelligence".

---

## 🚀 Quick Success Guide - Optimized for WSL2 (Penguin Power) & Linux

Our architecture prioritizes Linux virtual servers and Windows Subsystem for Linux (WSL). Native Windows servers are slow and problematic. We assume you want to run this master piece straight from the penguin!

### 1. Initializing the Web Server (WSL2/Linux/Termux)

Ensure your Ubuntu/Debian machine on WSL/VPS has Node v18+ and zip/unzip/tar installed to allow the panel to handle jars:
```bash
sudo apt update && sudo apt install -y curl unzip zip tar lsof htop git
```

Clone the panel (or navigate to your directory) and run:
```bash
npm install
npm run build
npm start
```
*(TIP: If there are port issues on WSL, run `killall node` and start again. Our system will magically skip dead ports.)*

The Panel will be alive at `http://localhost:3000`.

### 2. Creeper AI-Brain Configuration

The Creeper has a virtual mind of its own! The "AI Assist" button is always available.

1. Click on the sidebar tab **Settings**.
2. Find the **AI API (Universal)** section.
3. Insert your credentials:
   * **Local (LM Studio / Ollama):** Local endpoint to run Llama3 offline for free. The IP must be the Windows host if via WSL (e.g. 172.x.x.x or if properly mapped `http://localhost:1234/v1`).
   * **Gemini/Groq/OpenAI:** Direct API key for Cloud AI!
4. Hit **SAVE** and the gear will come to life!

### 3. Creating MULTIVERSE WORLDS

1. **Servers Tab:** Create a new one.
2. Magic Name, RAM (2 to 8GB to run smoothly on the Panel's Java21+!)
3. Choose *Paper* for RAM economy, or *Fabric* for fast Mods, *Forge* for nostalgia, or *Nukkit* (Bedrock C++ Bridge).
4. Upon clicking "CREATE WORLD", you notice a "magic download". The panel does EVERYTHING without downloading extra windows!

---

## 💎 Modular "Uninstall" System

The base Panel memory usage is ~30MB. But the FrontEnd (Your Browser) will get heavy if many magic tabs run!
**Turn off what you don't use** in the Settings panel:
* 3D Map Editor
* Internal In-Game Store
* Floating Terminal

---

## 🔥 Does it work on Android? Termux?

**YES!** The entire Panel interface is Mobile First! Through *Termux* on an 8GB RAM Android, install `nodejs`, do a `git pull`, `npm i`, and run it locally! Our large on-screen buttons will make it easy to tweak `server.properties` files right from your bed using your Smartphone!

---

## 🔄 Updating the System (AUTOMATIC GIT PULL!)

In the Settings tab, at the bottom of the page, we have the **UPDATE SYSTEM** button.
This button forces the penguin or mac to dispatch the magic command in the backend!
```bash
git fetch --all && git reset --hard origin/main && npm install && npm run build
```
Never again will you need to go down to the Linux Console to push/pull commits from this repo! But hey, **Ensure Git is correctly configured!**
