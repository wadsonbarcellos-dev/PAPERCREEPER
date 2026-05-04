# PaperCreeper - The Magic Minecraft Panel (AI + Scripts + Local Servers)

**PaperCreeper** is not just a hosting panel. It is your Minecraft server companion built with Artificial Intelligence and extreme focus on performance.
Create servers (Paper, Forge, Fabric, etc.), manage plugins, edit maps, tweak configs, inject native Magic Scripts, and export your game world in minutes—all guided by our "Creeper Intelligence".

## 🚀 Installation & Setup Guide (Step-by-Step)

Our architecture is heavily optimized for Linux virtualization and the Windows Subsystem for Linux (WSL2). Native Windows Node.js servers are notoriously slow for heavy Minecraft workflows. We assume you want to run this beast directly from the penguin!

### Method 1: Windows via WSL2 (The Best Way on Windows)

If you are on Windows, WSL2 is mandatory for optimal performance.

**Step 1: Enable WSL2 and Install Debian**
1. Open PowerShell as Administrator.
2. Run the command to install WSL and Debian directly:
   ```powershell
   wsl --install -d Debian
   ```
3. Restart your computer if prompted.
4. Open the "Debian" app from your Start Menu. It will ask you to create a UNIX username and password.

**Step 2: Install Dependencies inside Debian**
Once in your Debian terminal, update the system and install the required tools (Git, Node.js, cURL, etc.):
```bash
# Update repositories and install basics
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl unzip zip tar lsof htop git wget build-essential

# Install Node.js v20 (Required)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**Step 3: Clone PaperCreeper and Run**
```bash
# Clone the repository correctly
git clone https://github.com/wadbar/papercreeper.git
cd papercreeper

# Install dependencies and build
npm install
npm run build

# Start the panel
npm start
```
*The Panel will automatically open in your browser as a Standalone Web App!*

---

### Method 2: Linux (Ubuntu/Debian VPS) - The Server Way

Ensure your machine has Node v18+ and essential tools:
```bash
sudo apt update && sudo apt install -y curl unzip zip tar lsof htop git nodejs npm
git clone https://github.com/wadbar/papercreeper.git
cd papercreeper
npm install
npm run build
npm start
```
The Panel will be alive at `http://YOUR_SERVER_IP:3000`.

---

### Método 3: Android (Via Termux) - Mobile Native

**YES!** The whole Panel interface is Mobile First! Host and play directly from your phone!
Open your [Termux](https://f-droid.org/en/packages/com.termux/):
```bash
pkg update && pkg upgrade
pkg install nodejs git curl unzip zip tar
git clone https://github.com/wadbar/papercreeper.git
cd papercreeper
npm install
npm run build
npm start
```

---

## 🔁 How to Update Your Panel

We push new features frequently! To apply the latest updates directly from GitHub without breaking your servers:

```bash
# Make sure you are inside the panel's folder
cd papercreeper

# Fetch and reset to the latest origin
git fetch --all
git reset --hard origin/main

# Reinstall and rebuild just in case
npm install
npm run build

# Start it back up
npm start
```
*(You can also use the "Update Panel" button directly inside the app's Settings!)*

---

## 🤖 AI Configuration (Ollama & API Keys)

The Creeper has its own virtual mind! The "AI Assist" button is everywhere. We support both Cloud AI and Local AI.

### Setting up MULTIPLE API Keys for Auto-Fallback (Gemini/Groq)
In the Panel's Settings, you can now add **multiple API Keys separated by commas**!
If a key reaches its rate limit (Quota Exceeded), the Panel will automatically switch to the next key without interrupting your workflow.
1. Get a free API Key from [Google AI Studio](https://aistudio.google.com/app/apikey) or Groq.
2. Go to PaperCreeper > Settings > AI Provider.
3. Select "Cloud AI" and paste your keys: `AIzaSy..., AIzaSy..., gsk_...`
4. Choose the model and enjoy!

### Setting up Local AI (Ollama - 100% Free & Offline)
1. Install [Ollama](https://ollama.com/) on your host machine (Windows or Linux).
2. Open your terminal and download a fast model (like Llama3 or Qwen):
   ```bash
   ollama run llama3.2
   ```
3. Inside PaperCreeper, go to Settings. Change the AI Provider to **Local AI**.
4. Set the Endpoint:
   - If PaperCreeper is on Linux running Ollama locally: `http://127.0.0.1:11434/v1/chat/completions`
   - If PaperCreeper is inside WSL2, but Ollama is on Windows Host, use your WSL Gateway IP (e.g., `http://172.x.x.x:11434/v1/chat/completions` or check your WSL network settings).
   *(Note: You might need to set `OLLAMA_HOST=0.0.0.0` in your Windows Environment Variables to allow WSL connections).*

---

## 📜 The "Script Builder" vs The "Skript" Plugin

In our UI, you will see the **Script Builder** ("Fábrica de Scripts").
This tool uses AI to write automation scripts, custom commands, and new mechanics for your Minecraft server *on the fly*, without needing to compile Java plugins.

**How does it work?**
1. The AI generates a `.sk` file (a Skript).
2. For this file to be understood by Minecraft, your server **MUST** have the `Skript` plugin installed.
3. You can install the Skript plugin easily from our "Mods/Plugins Store" tab with one click.
4. Once installed, every time you use the Script Builder and click Save, it automatically puts the `.sk` file into `plugins/Skript/scripts/` and issues a `/sk reload all` command to your server, making your new script work instantly!

---

## 🌍 Managing Servers & Optimizations

- **Start/Stop/Kill:** Quick actions on the panel.
- **Auto-Java:** PaperCreeper automatically downloads and assigns the correct Java version (8, 17, or 21) based on the Minecraft version you select!
- **MCEdit / Map Editor:** We integrated an experimental Web-based 3D Map Viewer (like BlueMap) and a toolbar to send WorldEdit commands (like `//wand`, `//copy`, `//paste`, `//undo`) straight to the server! Native MCEdit is discontinued, so we combined Web Viewing + In-Game WorldEdit for the best experience.

**Performance Warning:** 
Keep the map viewer closed if you are low on RAM!

---
*Developed with 💚 using Full-Stack AI Automation.*