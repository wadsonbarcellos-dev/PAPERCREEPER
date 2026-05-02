import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { exec, spawn, execSync } from "child_process";
import fs from "fs";
import os from "os";
import multer from "multer";
import { GoogleGenAI, Type } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração IA no Backend (Totalmente Automática no AI Studio)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "AIza_fallback",
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const SERVERS_ROOT = path.join(process.cwd(), "servers");
  if (!fs.existsSync(SERVERS_ROOT)) fs.mkdirSync(SERVERS_ROOT);

  // Migration logic
  const OLD_DIR = path.join(process.cwd(), "minecraft-server");
  if (fs.existsSync(OLD_DIR)) {
    const target = path.join(SERVERS_ROOT, "default");
    if (!fs.existsSync(target)) {
      fs.renameSync(OLD_DIR, target);
      const cfgP = path.join(target, "panel-config.json");
      if (fs.existsSync(cfgP)) {
        try {
          const c = JSON.parse(fs.readFileSync(cfgP, "utf-8"));
          fs.writeFileSync(
            cfgP,
            JSON.stringify({ ...c, name: "Principal" }, null, 2),
          );
        } catch (e) {}
      }
    }
  }

  const getServerDir = (id: string) => path.join(SERVERS_ROOT, id);
  const getSrvConfigPath = (id: string) =>
    path.join(getServerDir(id), "panel-config.json");
  const DEFAULT_CONFIG = {
    name: "Novo Servidor",
    ram: 4,
    minRam: 1,
    usePlayit: true,
    store: {
      name: "Loja Oficial",
      color: "#10b981",
      items: [
        {
          id: "vip-hero",
          name: "VIP Hero",
          description: "Rank VIP (1 Mês) + Kit Hero",
          price: 25.0,
          commands: [
            "lp user {player} parent add vip",
            "eco give {player} 5000",
            "say O jogador {player} acabou de adquirir o VIP Hero!",
          ],
        },
        {
          id: "money-10k",
          name: "10.000 Coins",
          description: "Adicione fundos na sua conta in-game",
          price: 10.0,
          commands: [
            "eco give {player} 10000",
            "msg {player} Obrigado por adquirir Coins!",
          ],
        },
        {
          id: "perk-fly",
          name: "Permissão /Fly",
          description: "Voe livremente pelo lobby/spawn",
          price: 15.0,
          commands: [
            "lp user {player} permission set essentials.fly true",
            "say {player} agora pode voar!",
          ],
        },
      ],
    },
  };

  const getSrvConfig = (id: string) => {
    try {
      const p = getSrvConfigPath(id);
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, "utf-8"));
    } catch (e) {}
    return { ...DEFAULT_CONFIG, name: id };
  };

  const saveSrvConfig = (id: string, config: any) => {
    const dir = getServerDir(id);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(getSrvConfigPath(id), JSON.stringify(config, null, 2));
  };

  // Multer
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const sId = (req.query.serverId as string) || "default";
      const folder = (req.query.folder as string) || "";
      const safeBase = getServerDir(sId);
      const tDir = path.join(safeBase, folder);

      if (!tDir.startsWith(safeBase)) {
        cb(new Error("Acesso negado fora da raiz do servidor!"), "");
        return;
      }

      if (!fs.existsSync(tDir)) fs.mkdirSync(tDir, { recursive: true });
      cb(null, tDir);
    },
    filename: (req, file, cb) => cb(null, file.originalname),
  });
  const upload = multer({ storage });

  // Global Playit variables
  let globalPlayitProcess: any = null;
  let globalPlayitClaimUrl: string | null = null;
  let globalPlayitClaimLastSeen: number = 0;
  let globalPlayitLogs: string[] = [];

  // State
  const serversState: Record<
    string,
    {
      status: "online" | "offline" | "starting" | "stopping";
      tunnelAddress: string | null;
      logs: string[];
      process?: any;
    }
  > = {};

  const ensureState = (id: string) => {
    if (!serversState[id]) {
      serversState[id] = {
        status: "offline",
        tunnelAddress: null,
        logs: ["Painel pronto!"],
      };
    }
  };

  const addLog = (id: string, msg: string) => {
    ensureState(id);
    const time = new Date().toLocaleTimeString([], { hour12: false });
    serversState[id].logs.push(`[${time}] ${msg}`);
    if (serversState[id].logs.length > 200) serversState[id].logs.shift();
  };

  const BIN_DIR = path.resolve(process.cwd(), "bin");
  if (!fs.existsSync(BIN_DIR)) fs.mkdirSync(BIN_DIR, { recursive: true });

  // Java 21 path (Crucial for 1.21+)
  const JAVA_BIN = path.join(BIN_DIR, "java_runtime/bin/java");
  const PLAYIT_BIN = path.join(BIN_DIR, "playit");

  let JAVA_PATH = "java";
  let PLAYIT_PATH = "playit";

  // === DYNAMIC JAVA EXTRACTOR ===
  const getRequiredJavaMajor = (mcVersion: string) => {
    if (!mcVersion) return 21;
    const match = mcVersion.match(/1\.(\d+)(?:\.(\d+))?/);
    if (!match) return 21;
    const minor = parseInt(match[1], 10);
    if (minor <= 16) return 8; 
    if (minor === 17) return 17; 
    if (minor <= 20) return 17;
    return 21;
  };

  const getJavaPath = (major: number) => {
    const javaDir = path.join(BIN_DIR, `java_runtime_${major}`);
    const osPlatform = os.platform();
    if (osPlatform === "win32") {
      return path.join(javaDir, "bin/java.exe");
    }
    return path.join(javaDir, "bin/java");
  };

  const downloadJavaIfNeeded = (major: number, onLog: (msg: string) => void): Promise<string> => {
    return new Promise((resolve) => {
      const javaExec = getJavaPath(major);
      try {
        if (fs.existsSync(javaExec)) {
          execSync(`"${javaExec}" -version`, { stdio: "ignore" });
          return resolve(javaExec);
        }
      } catch(e) {}
      
      const osPlatform = os.platform();
      let sysJava = osPlatform === "win32" ? "java.exe" : "java";
      try {
        const sysVer = execSync(`"${sysJava}" -version 2>&1`, { encoding: "utf-8" });
        const match = sysVer.match(/version "(\d+)\./);
        if (match && parseInt(match[1], 10) === major) {
          onLog(`[INFO] Usando Java ${major} do sistema.`);
          return resolve(sysJava);
        }
      } catch (e) {}

      const javaDir = path.join(BIN_DIR, `java_runtime_${major}`);
      onLog(`[INSTALLER] Instalando Java ${major} Otimizado para esta versao... aguarde.`);
      
      let file = "";
      const osArch = os.arch();
      if (major === 8) {
          if (osPlatform === "win32") file = "OpenJDK8U-jre_x64_windows_hotspot_8u442b06.zip";
          else if (osPlatform === "darwin") file = osArch === "arm64" ? "OpenJDK8U-jre_aarch64_mac_hotspot_8u442b06.tar.gz" : "OpenJDK8U-jre_x64_mac_hotspot_8u442b06.tar.gz";
          else file = osArch === "arm64" ? "OpenJDK8U-jre_aarch64_linux_hotspot_8u442b06.tar.gz" : "OpenJDK8U-jre_x64_linux_hotspot_8u442b06.tar.gz";
      } else if (major === 17) {
          if (osPlatform === "win32") file = "OpenJDK17U-jre_x64_windows_hotspot_17.0.14_7.zip";
          else if (osPlatform === "darwin") file = osArch === "arm64" ? "OpenJDK17U-jre_aarch64_mac_hotspot_17.0.14_7.tar.gz" : "OpenJDK17U-jre_x64_mac_hotspot_17.0.14_7.tar.gz";
          else file = osArch === "arm64" ? "OpenJDK17U-jre_aarch64_linux_hotspot_17.0.14_7.tar.gz" : "OpenJDK17U-jre_x64_linux_hotspot_17.0.14_7.tar.gz";
      } else {
          if (osPlatform === "win32") file = "OpenJDK21U-jre_x64_windows_hotspot_21.0.6_7.zip";
          else if (osPlatform === "darwin") file = osArch === "arm64" ? "OpenJDK21U-jre_aarch64_mac_hotspot_21.0.6_7.tar.gz" : "OpenJDK21U-jre_x64_mac_hotspot_21.0.6_7.tar.gz";
          else file = osArch === "arm64" ? "OpenJDK21U-jre_aarch64_linux_hotspot_21.0.6_7.tar.gz" : "OpenJDK21U-jre_x64_linux_hotspot_21.0.6_7.tar.gz";
      }

      let url = "";
      if (major === 8) url = `https://github.com/adoptium/temurin8-binaries/releases/download/jdk8u442-b06/${file}`;
      else if (major === 17) url = `https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.14%2B7/${file}`;
      else url = `https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.6%2B7/${file}`;

      const tempTar = path.join(BIN_DIR, file);

      try {
          if (fs.existsSync(javaDir)) fs.rmSync(javaDir, { recursive: true, force: true });
          fs.mkdirSync(javaDir, { recursive: true });

          exec(`curl -A "Mozilla/5.0" -L "${url}" -o "${tempTar}"`, (err) => {
             if (err) {
                 onLog(`[ERROR] Falha ao baixar Java: ${err.message}`);
                 return resolve("java");
             }
             try {
                if (file.endsWith(".zip")) {
                  execSync(`unzip -q -o "${tempTar}" -d "${javaDir}"`);
                  const items = fs.readdirSync(javaDir);
                  if (items.length === 1 && fs.lstatSync(path.join(javaDir, items[0])).isDirectory()) {
                     const inner = path.join(javaDir, items[0]);
                     fs.cpSync(inner, javaDir, { recursive: true });
                     fs.rmSync(inner, { recursive: true });
                  }
                } else {
                  execSync(`tar -xf "${tempTar}" -C "${javaDir}" --strip-components=1`);
                }
                fs.rmSync(tempTar, { force: true });
                if (osPlatform !== "win32") {
                  execSync(`chmod -R +x "${path.join(javaDir, "bin")}"`);
                }
                onLog(`[SUCCESS] Java ${major} instalado e pronto.`);
                resolve(getJavaPath(major));
             } catch(extErr: any) {
                onLog(`[ERROR] Falha ao extrair Java: ${extErr.message}`);
                resolve("java");
             }
          });
      } catch (e: any) {
          onLog(`[ERROR] Erro no script de Java: ${e.message}`);
          resolve("java");
      }
    });
  };

  const resolveBinaries = async () => {
    const osPlatform = os.platform();
    let playitFile = "playit-linux-amd64";
    if (osPlatform === "win32") playitFile = "playit-windows-x86_64.exe";
    else if (osPlatform === "darwin") playitFile = "playit-macos-aarch64";
    else {
      const osArch = os.arch();
      if (osArch === "arm64") playitFile = "playit-linux-aarch64";
      else if (osArch === "arm") playitFile = "playit-linux-armv7"; // fallback
    }

    PLAYIT_PATH = path.join(BIN_DIR, playitFile);

    if (fs.existsSync(PLAYIT_PATH)) {
      if (osPlatform !== "win32") {
        try {
          fs.chmodSync(PLAYIT_PATH, 0o755);
        } catch (e) {}
      }
    }
  };

  const downloadDependencies = async () => {
    await resolveBinaries();

    // Playit setup if missing
    if (!fs.existsSync(PLAYIT_PATH)) {
      addLog("system", " [SETUP] Playit não encontrado, baixando...");
      const playitUrl = `https://github.com/playit-cloud/playit-agent/releases/latest/download/${path.basename(PLAYIT_PATH)}`;
      exec(
        `curl -A "Mozilla/5.0" -L "${playitUrl}" -o "${PLAYIT_PATH}"`,
        (err) => {
          if (!err) {
            if (os.platform() !== "win32") {
              try {
                fs.chmodSync(PLAYIT_PATH, 0o755);
              } catch (e) {}
            }
            addLog("system", " [SUCCESS] Playit.gg pronto!");
            // Ensure binary is usable
            exec(`"${PLAYIT_PATH}" version`, (vErr, vOut) => {
              if (!vErr) console.log("[PLAYIT VERSION]", vOut.trim());
            });
          } else {
            addLog("system", " [ERROR] Erro ao baixar Playit: " + err.message);
          }
        },
      );
    }
  };

  downloadDependencies();

  const startGlobalTunnel = () => {
    if (globalPlayitProcess) return;
    const runTunnel = () => {
      if (!fs.existsSync(PLAYIT_PATH)) {
        setTimeout(runTunnel, 5000);
        return;
      }
      try {
        const persistentConfig = path.join(process.cwd(), "playit.toml");

        const args = ["-s", "--platform_docker"];
        if (fs.existsSync(persistentConfig)) {
          args.push("--secret_path", persistentConfig);
        }
        args.push("start");

        globalPlayitProcess = spawn(PLAYIT_PATH, args, {
          stdio: ["ignore", "pipe", "pipe"],
          env: { ...process.env, RUST_LOG: "debug", RUST_BACKTRACE: "1" },
        });
      } catch (err) {
        console.error(`[Global Playit] Failed to spawn:`, err);
        return;
      }

      globalPlayitProcess.on("error", (err: any) => {
        console.error(`[Global Playit] process error:`, err);
      });

      const handleOutput = (data: Buffer, isErr: boolean) => {
        const msg = data
          .toString()
          .replace(/\x1b\[[0-9;]*m/g, "")
          .trim();
        if (msg) {
          globalPlayitLogs.push((isErr ? "[ERR] " : "[OUT] ") + msg);
          if (globalPlayitLogs.length > 20) globalPlayitLogs.shift();

          const claimMatch = msg.match(
            /(https:\/\/(?:www\.)?playit\.gg\/claim\/[a-zA-Z0-9_-]+)/i,
          );
          if (claimMatch) {
            globalPlayitClaimUrl = claimMatch[1];
            globalPlayitClaimLastSeen = Date.now();
          }
        }
      };

      globalPlayitProcess.stdout.on("data", (data: any) =>
        handleOutput(data, false),
      );
      globalPlayitProcess.stderr.on("data", (data: any) =>
        handleOutput(data, true),
      );

      globalPlayitProcess.on("close", () => {
        globalPlayitProcess = null;
        // Se algum servidor online estiver usando playit, reinicia o túnel
        const needsTunnel = Object.values(serversState).some(
          (s) => s.status === "online" || s.status === "starting",
        );
        if (needsTunnel) {
          setTimeout(startGlobalTunnel, 5000);
        }
      });
    };
    runTunnel();
  };

  // API Routes
  app.post("/api/config/env", (req, res) => {
    const { key } = req.body;
    if (key && key.length > 5) {
      process.env.UNIVERSAL_API_KEY = key;
      const envPath = path.join(process.cwd(), ".env");
      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf-8");
      }
      if (envContent.includes("UNIVERSAL_API_KEY=")) {
        envContent = envContent.replace(
          /UNIVERSAL_API_KEY=.*/g,
          `UNIVERSAL_API_KEY=${key}`,
        );
      } else {
        envContent += `\nUNIVERSAL_API_KEY=${key}\n`;
      }
      fs.writeFileSync(envPath, envContent);
      res.json({ success: true });
    } else {
      res.status(400).json({ error: "Chave inválida." });
    }
  });

  // --- API IA (UNIVERSAL) ---
  app.post("/api/ai", async (req, res) => {
    try {
      const { prompt, context, serverId, provider, endpoint, history } = req.body;
      const sId = serverId || "default";

      const currentKey =
        process.env.UNIVERSAL_API_KEY || process.env.GEMINI_API_KEY || "";
      
      if (provider !== "local" && (!currentKey || currentKey === "AIza_fallback")) {
        throw new Error("API Key não configurada. Configure no menu de IA.");
      }

      // Instrução de sistema para manter a personalidade
      const systemInstruction = `
Você é o "PaperCreeper AI", o OPERADOR SUPREMO e ENGENHEIRO de servidores Minecraft.
Personalidade: Técnico, eficiente, prestativo e com um toque de humor "Minecrafter". Use emojis como ⛏️, 💎, 🔥, 🧨, 🛡️.

SUAS CAPACIDADES (Nomes das ferramentas suportadas):
- "startServer": Iniciar o servidor
- "stopServer": Parar o servidor
- "sendTerminalCommand": Executar comando in-game (args: { "command": "cmd" })
- "updateRAM": Ajustar RAM em GB (args: { "ram": 4 })
- "readFile": Ler arquivo (args: { "path": "server.properties" })
- "saveFile": Escrever arquivo (args: { "path": "arquivo", "content": "conteudo" })
- "listFiles": Listar pasta (args: { "folder": "plugins" })
- "executeTerminal": Shell linux no host (args: { "command": "ls" })

FORMATO DE RESPOSTA OBRIGATÓRIO PARA AÇÕES:
Quando decidir realizar uma ação técnica, inclua no final da sua resposta estritamente este bloco JSON:
[ACTION:{"name": "nomeDaFerramenta", "args": {"parametro": "valor"}}]

Exemplo: "Vou deixar de dia! [ACTION:{"name": "sendTerminalCommand", "args": {"command": "time set day"}}]"
      `;

      let text = "";

      if (provider === "local") {
        // Local AI (LM Studio, Ollama, etc) via OpenAI API compatible endpoint
        const targetEndpoint = endpoint || "http://127.0.0.1:1234/v1/chat/completions";
        const messages = [{ role: "system", content: systemInstruction }];
        if (context) messages.push({ role: "system", content: `CONTEXTO ATUAL DO SERVIDOR:\n${context}` });
        
        if (history && Array.isArray(history)) {
          history.forEach(msg => messages.push({ role: msg.role === "assistant" ? "assistant" : "user", content: msg.text }));
        }
        
        messages.push({ role: "user", content: prompt });

        const oaiRes = await fetch(targetEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // A adição de 'model' dummy previne erros em algumas instâncias do LM Studio que requerem o campo
          body: JSON.stringify({ model: "local-model", messages, temperature: 0.7 })
        });
        
        if (!oaiRes.ok) throw new Error(`Http error ${oaiRes.status}`);
        const oaiData: any = await oaiRes.json();
        text = oaiData.choices?.[0]?.message?.content || "";

      } else if (currentKey.startsWith("AIza") && provider !== "openai") {
        // Gemini API via @google/genai
        const localAi = new GoogleGenAI({ apiKey: currentKey });
        
        const formattedHistory = (history || []).map((msg: any) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.text }]
        }));

        const chat = localAi.chats.create({
          model: "gemini-2.5-flash",
          config: {
            systemInstruction,
            temperature: 0.8,
            topP: 0.95,
            topK: 64,
          },
          history: formattedHistory
        });
        
        const result = await chat.sendMessage({ 
          message: `${context ? `CONTEXTO ATUAL DO SERVIDOR:\n${context}\n\n` : ""}${prompt}` 
        });
        text = result.text;
      } else {
        // External OpenAI-compatible (Groq, xAI, OpenAI)
        let targetEndpoint = "https://api.openai.com/v1/chat/completions";
        let model = "gpt-4o-mini";

        if (currentKey.startsWith("gsk_")) {
          targetEndpoint = "https://api.groq.com/openai/v1/chat/completions";
          model = "llama-3.3-70b-versatile"; 
        } else if (currentKey.startsWith("xai-")) {
          targetEndpoint = "https://api.x.ai/v1/chat/completions";
          model = "grok-2-latest";
        }

        const messages = [{ role: "system", content: systemInstruction }];
        if (context) messages.push({ role: "system", content: `CONTEXTO ATUAL DO SERVIDOR:\n${context}` });
        
        if (history && Array.isArray(history)) {
          history.forEach(msg => messages.push({ role: msg.role === "assistant" ? "assistant" : "user", content: msg.text }));
        }

        messages.push({ role: "user", content: prompt });

        const oaiRes = await fetch(targetEndpoint, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${currentKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.8,
          }),
        });

        if (!oaiRes.ok) {
          const errJson = await oaiRes.json().catch(() => ({}));
          throw new Error(
            errJson.error?.message || `Http error ${oaiRes.status}`,
          );
        }

        const oaiData: any = await oaiRes.json();
        text = oaiData.choices?.[0]?.message?.content || "";
      }

      // Tenta extrair ações do texto de forma resiliente
      let call = null;
      let actionStart = text.indexOf("[ACTION:");
      
      if (actionStart !== -1) {
        let actionEnd = text.lastIndexOf("]");
        if (actionEnd > actionStart) {
           let jsonStr = text.substring(actionStart + 8, actionEnd).trim();
           // Remove possíveis wrappers de markdown gerados pela IA
           jsonStr = jsonStr.replace(/```json/gi, "").replace(/```/g, "").trim();
           try {
             call = JSON.parse(jsonStr);
             text = text.substring(0, actionStart).trim();
           } catch(e) {
             console.log("Failed to parse action json", jsonStr);
           }
        }
      }

      res.json({ text, call });
    } catch (error: any) {
      console.error("AI Server Error:", error);
      let message = error.message;
      if (
        message.includes("API key not valid") ||
        message.includes("403") ||
        message.includes("401")
      ) {
        message = "Chave API inválida ou não configurada.";
      }
      res.status(500).json({
        error: message,
        details: error.message,
      });
    }
  });

  // --- Public Store ---
  app.get("/s/:serverId", (req, res) => {
    const { serverId } = req.params;
    let config;
    try {
      config = getSrvConfig(serverId);
    } catch (e) {
      return res.status(404).send("Servidor não encontrado.");
    }

    // Serve a simple HTML page using Tailwind CSS via CDN for the store.
    const storeName = config.store?.name || config.name || "Loja do Servidor";
    const themeColor = config.store?.color || "#10b981"; // default emerald
    const items = config.store?.items || [];

    const state: any = serversState[serverId] || {};
    const serverIp = state.tunnelAddress || "Requer inicialização...";

    const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Loja - ${storeName}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        body { background-color: #09090b; color: #f4f4f5; font-family: sans-serif; }
        .theme-border { border-color: ${themeColor} !important; }
        .theme-bg { background-color: ${themeColor} !important; }
        .theme-text { color: ${themeColor} !important; }
      </style>
    </head>
    <body class="min-h-screen flex flex-col items-center py-12 px-4 space-y-12">
      <header class="text-center space-y-4">
        <h1 class="text-5xl font-black theme-text tracking-tighter">${storeName}</h1>
        <p class="text-zinc-400 font-medium">Jogue agora: <span class="bg-zinc-800 px-3 py-1 rounded-md text-white select-all border border-zinc-700">${serverIp}</span></p>
      </header>
      
      <main class="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        ${items.length === 0 ? '<p class="text-zinc-500 text-center col-span-3 py-10">Nenhum pacote disponível na loja ainda.</p>' : ""}
        ${items
          .map(
            (i: any) => `
          <div class="bg-zinc-900 border-2 theme-border border-opacity-30 rounded-3xl p-6 flex flex-col space-y-4 shadow-2xl relative overflow-hidden">
             <div class="absolute top-0 right-0 p-4 opacity-10">
               <svg xmlns="http://www.w3.org/-svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${themeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
             </div>
             
             <h3 class="text-2xl font-bold z-10">${i.name}</h3>
             <p class="text-zinc-400 text-sm flex-grow z-10">${i.description || ""}</p>
             <div class="text-3xl font-black mt-4 z-10">R$ ${Number(i.price).toFixed(2)}</div>
             <button onclick="buy('${i.id}', '${i.name}')" class="w-full py-4 mt-2 rounded-xl theme-bg text-black font-black uppercase tracking-widest hover:opacity-90 transition-opacity z-10 shadow-lg cursor-pointer">
               Adquirir Pacote
             </button>
          </div>
        `,
          )
          .join("")}
      </main>
      
      <script>
        function buy(itemId, itemName) {
          const nick = prompt("Você está adquirindo: " + itemName + "\\nQual seu Nickname exato no servidor?");
          if (!nick) return;
          
          fetch('/api/public/store/buy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ serverId: '${serverId}', itemId, player: nick })
          }).then(res => res.json()).then(data => {
            if (data.success) {
              alert("🎉 Pagamento simulado com sucesso!\\nO pacote foi entregue no servidor para o jogador " + nick + ".");
            } else {
              alert("❌ Erro: " + (data.error || "Servidor indisponível ou offline."));
            }
          }).catch(() => alert("❌ Erro ao conectar ao painel."));
        }
      </script>
    </body>
    </html>
    `;
    res.send(html);
  });

  app.post("/api/public/store/buy", (req, res) => {
    const { serverId, itemId, player } = req.body;
    if (!serverId || !itemId || !player)
      return res.status(400).json({ error: "Dados incompletos" });

    // Simulate payment success and run commands
    let config;
    try {
      config = getSrvConfig(serverId);
    } catch (e) {
      return res.status(404).json({ error: "Server config not found" });
    }

    const store = config.store || {};
    const items = store.items || [];
    const item = items.find((i: any) => i.id === itemId);

    if (!item) return res.status(404).json({ error: "Item não encontrado" });

    const srv = serversState[serverId];
    if (!srv || !srv.process || srv.status !== "online") {
      return res.status(400).json({
        error:
          "O servidor precisa estar Online (Ligado) para processar o pacote.",
      });
    }

    // Fire commands
    const cmds = item.commands || [];
    if (cmds.length === 0) {
      const defaultCmd = `say O jogador ${player} adquiriu ${item.name}! Muito obrigado pelo apoio!`;
      srv.process.stdin.write(defaultCmd + "\\n");
      addLog(serverId, `[STORE] Executado (Cmd Padrão): ${defaultCmd}`);
    } else {
      for (const rawCmd of cmds) {
        let runCmd = rawCmd
          .replace(/{player}/g, player)
          .replace(/{player}/gi, player);
        if (runCmd.startsWith("/")) runCmd = runCmd.substring(1);
        srv.process.stdin.write(runCmd + "\\n");
        addLog(serverId, `[STORE] Executado via Loja: ${runCmd}`);
      }
    }

    res.json({ success: true });
  });

  app.post("/api/public/store/auth", (req, res) => {
    const { username, password, serverId } = req.body;
    // Integração simulada: a loja consultaria o banco de dados do plugin AuthMe/nLogin ou enviaria comandos
    // para um proxy no servidor validando o hash.

    setTimeout(() => {
      // Simula delay de rede e hash check
      if (password === "demo123" || password === "admin") {
        res.json({
          success: true,
          user: {
            username,
            uuid: "mock-uuid-123",
            coins: 12500,
            rank: "VIP Lenda",
          },
        });
      } else if (password) {
        res.json({
          success: true,
          user: { username, uuid: "mock-uuid-456", coins: 150, rank: "Membro" },
        });
      } else {
        res.status(401).json({ error: "Credenciais inválidas." });
      }
    }, 600);
  });

  app.post("/api/server/store", (req, res) => {
    const { serverId, store } = req.body;
    if (!serverId)
      return res.status(400).json({ error: "Servidor não informado" });
    const config = getSrvConfig(serverId);
    config.store = store;
    saveSrvConfig(serverId, config);
    res.json({ success: true });
  });

  app.get("/api/servers", (req, res) => {
    if (!fs.existsSync(SERVERS_ROOT)) return res.json({ servers: [] });
    const servers = fs
      .readdirSync(SERVERS_ROOT)
      .filter((id) => fs.lstatSync(path.join(SERVERS_ROOT, id)).isDirectory());
    const data = servers.map((id) => {
      const config = getSrvConfig(id);
      return {
        id,
        name: config.name,
        ram: config.ram,
        minRam: config.minRam,
        type: config.type,
        version: config.version,
        store: config.store || null,
      };
    });
    res.json({ servers: data });
  });

  app.post("/api/server/files/upload", upload.array("files"), (req, res) => {
    res.json({ success: true });
  });

  app.post("/api/servers/create", (req, res) => {
    const { name, ram, type, version, usePlayit } = req.body;
    const id =
      (name || "server")
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now().toString().slice(-4);
    const dir = getServerDir(id);
    fs.mkdirSync(dir, { recursive: true });

    // Ensure plugins folder exists immediately
    const pluginsDir = path.join(dir, "plugins");
    if (!fs.existsSync(pluginsDir))
      fs.mkdirSync(pluginsDir, { recursive: true });

    saveSrvConfig(id, {
      ...DEFAULT_CONFIG,
      name: name || "Novo Servidor",
      ram: Number(ram) || 4,
      type: type || "paper",
      version: version || "1.21.1",
      usePlayit: usePlayit !== undefined ? usePlayit : true,
    });
    res.json({ id });
  });

  const autoInjectAICore = (serverId: string) => {
    const srvDir = getServerDir(serverId);
    const pluginsDir = path.join(srvDir, "plugins");
    if (!fs.existsSync(pluginsDir))
      fs.mkdirSync(pluginsDir, { recursive: true });

    const skriptUrl =
      "https://github.com/SkriptLang/Skript/releases/download/2.9.3/Skript.jar";
    const dest = path.join(pluginsDir, "Skript.jar");

    const finishInjection = () => {
      // Inject Skript Script
      const skDir = path.join(pluginsDir, "Skript", "scripts");
      if (!fs.existsSync(skDir)) fs.mkdirSync(skDir, { recursive: true });
      const skFile = path.join(skDir, "creeper-inject.sk");
      const skContent = `
# PaperCreeper AI - Inject Script
on load:
    send "[AI] PaperCreeper AI Inject ativado com sucesso! 💎" to console
    send "[AI] Motor de Inteligência Articulada pronto para ordens." to console

command /creeper-ai <text>:
    permission: op
    trigger:
        send "[AI] Executando comando cerebral: %arg-1%" to console
        execute console command arg-1
`;
      if (!fs.existsSync(skFile)) fs.writeFileSync(skFile, skContent);
    };

    if (!fs.existsSync(dest)) {
      addLog(serverId, "[AI] Injetando motor de poder (Skript)...");
      exec(`curl -L "${skriptUrl}" -o "${dest}"`, (err) => {
        if (err)
          console.error(
            `[AI ERROR] Failed to auto-inject Skript to ${serverId}:`,
            err,
          );
        else {
          addLog(serverId, "[AI] Motor de poder injetado com sucesso! 💎");
          finishInjection();
        }
      });
    } else {
      finishInjection();
    }
  };

  app.post("/api/servers/rename", (req, res) => {
    const { serverId, name } = req.body;
    const config = getSrvConfig(serverId);
    saveSrvConfig(serverId, { ...config, name });
    res.json({ success: true });
  });

  app.post("/api/server/update-config", (req, res) => {
    const { serverId, name, ram, minRam, usePlayit, store } = req.body;
    if (!serverId)
      return res.status(404).json({ error: "Servidor não encontrado" });

    ensureState(serverId);
    const configPath = path.join(getServerDir(serverId), "creeper.json");
    const config = getSrvConfig(serverId);

    const newConfig = {
      ...config,
      name: name || config.name,
      ram: ram !== undefined ? ram : config.ram,
      minRam: minRam !== undefined ? minRam : config.minRam,
      usePlayit: usePlayit !== undefined ? usePlayit : config.usePlayit,
      store: store !== undefined ? store : config.store,
    };

    saveSrvConfig(serverId, newConfig);

    res.json({ success: true });
  });

  app.get("/api/ai/test", async (req, res) => {
    try {
      const currentKey = process.env.GEMINI_API_KEY || "AIza_fallback";
      const localAi = new GoogleGenAI({ apiKey: currentKey });
      const result = await localAi.models.generateContent({
        model: "gemini-1.5-flash",
        contents: "Say hello",
      });
      res.json({ success: true, text: result.text });
    } catch (e: any) {
      res.status(500).json({
        error: e.message,
        envKeyType: typeof process.env.GEMINI_API_KEY,
        envKeyLen: process.env.GEMINI_API_KEY?.length,
      });
    }
  });

  app.post("/api/server/skript/reload", (req, res) => {
    const { serverId } = req.body;
    if (!serverId) return res.status(400).json({ error: "Server ID required" });
    const sId =
      serverId === "default"
        ? Object.keys(serversState)[0] || "default"
        : serverId;
    const proc = serversState[sId]?.process;
    if (proc) {
      proc.stdin.write("sk reload all\n");
    }
    res.json({ success: true });
  });

  app.get("/api/server/status", (req, res) => {
    const id = (req.query.serverId as string) || "default";

    if (id !== "default" && !fs.existsSync(getServerDir(id))) {
      return res.status(404).json({ error: "Server deleted" });
    }

    const lastLogIdx = parseInt(req.query.lastLogIdx as string) || 0;
    ensureState(id);
    const config = getSrvConfig(id);
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const cpuLoad = os.loadavg()[0];

    const allLogs = serversState[id].logs;
    const newLogs = lastLogIdx > 0 ? allLogs.slice(lastLogIdx) : allLogs;

    res.json({
      status: serversState[id].status,
      tunnel: serversState[id].tunnelAddress,
      logs: newLogs,
      logCount: allLogs.length,
      config,
      stats: {
        cpu: `${(cpuLoad * 10).toFixed(1)}%`,
        ram: `${((totalMem - freeMem) / 1024 / 1024 / 1024).toFixed(1)} / ${(totalMem / 1024 / 1024 / 1024).toFixed(1)} GB`,
        ramPercent: Math.round(((totalMem - freeMem) / totalMem) * 100),
      },
    });
  });

  app.post("/api/server/config", (req, res) => {
    const { serverId, ram, minRam } = req.body;
    ensureState(serverId);
    if (serversState[serverId].status !== "offline")
      return res.status(400).json({ error: "Desligue o servidor!" });
    const current = getSrvConfig(serverId);
    saveSrvConfig(serverId, {
      ...current,
      ram: Number(ram),
      minRam: Number(minRam || 1),
    });
    addLog(serverId, `[CONFIG] RAM: ${ram}GB.`);
    res.json({ message: "Salvo!" });
  });

  app.post("/api/server/config/ram", (req, res) => {
    const { serverId, ram } = req.body;
    const config = getSrvConfig(serverId);
    saveSrvConfig(serverId, { ...config, ram: Number(ram) });
    res.json({ success: true });
  });

  app.post("/api/server/execute", (req, res) => {
    const { serverId, command } = req.body;
    if (!command) return res.status(400).json({ error: "Comando vazio" });

    // ATENÇÃO: Executa comandos reais no SO! Use com cuidado.
    exec(
      command,
      { cwd: getServerDir(serverId || "default") },
      (err, stdout, stderr) => {
        if (err) return res.json({ success: false, output: stderr });
        res.json({ success: true, output: stdout });
      },
    );
  });

  app.post("/api/server/start", async (req, res) => {
    const { serverId } = req.body;
    if (!serverId) return res.status(400).json({ error: "No ID" });
    ensureState(serverId);
    if (serversState[serverId].status !== "offline")
      return res.status(400).json({ error: "Já rodando." });

    const srvDir = getServerDir(serverId);
    if (!fs.existsSync(srvDir))
      return res.status(404).json({ error: "Pasta não existe" });

    // Auto-EULA
    fs.writeFileSync(path.join(srvDir, "eula.txt"), "eula=true");

    const runShPath = path.join(srvDir, "run.sh");
    // Forge 1.17+ wrapper creates run.sh. If it exists, prioritize it.
    const jarFile = fs
      .readdirSync(srvDir)
      .filter((f) => f.endsWith(".jar") && !f.includes("installer"))
      .sort()[0];

    if (!fs.existsSync(runShPath) && !jarFile) {
      return res
        .status(400)
        .json({ error: "Instale um servidor (JAR ou run.sh) primeiro." });
    }

    const config = getSrvConfig(serverId);

    serversState[serverId].status = "starting";
    serversState[serverId].logs = []; // Limpa logs anteriores
    addLog(serverId, `🚀 Iniciando Minecraft...`);

    // DYNAMIC JAVA SELECTION
    let assumedVersion = config.mcVersion || "";
    if (!assumedVersion && jarFile) {
        const match = jarFile.match(/1\.\d+(?:\.\d+)?/);
        if (match) assumedVersion = match[0];
    }
    let reqMajor = getRequiredJavaMajor(assumedVersion);
    if (config.javaVersion) reqMajor = parseInt(config.javaVersion, 10);
    
    // Resolve dynamic java Path
    res.json({ message: "Iniciando..." }); // Envia resposta cedo para evitar timeout do front
    
    try {
      const dynamicJavaPath = await downloadJavaIfNeeded(reqMajor, (msg) => addLog(serverId, msg));

      addLog(serverId, `⚙️ RAM: ${config.ram}GB | Java: ${dynamicJavaPath} | Server: ${assumedVersion}`);

      let command = dynamicJavaPath;
      const type = (config.type || "").toLowerCase();
      let args = [
        "-Xmx" + config.ram + "G",
        "-Xms" +
          (config.minRam || Math.max(1, Math.floor(config.ram / 2))) +
          "G",
      ];

      // --- SELEÇÃO DINÂMICA DE FLAGS (LINUX PRO OPTIMIZED) ---
      if (
        [
          "paper",
          "purpur",
          "spigot",
          "fabric",
          "mohist",
          "forge",
          "vanilla",
        ].includes(type)
      ) {
        // AIKAR'S FLAGS (O padrão ouro para Survival/Modded)
        args.push(
          "-XX:+UseG1GC",
          "-XX:+ParallelRefProcEnabled",
          "-XX:MaxGCPauseMillis=200",
          "-XX:+UnlockExperimentalVMOptions",
          "-XX:+DisableExplicitGC",
          "-XX:+AlwaysPreTouch",
          "-XX:G1NewSizePercent=30",
          "-XX:G1MaxNewSizePercent=40",
          "-XX:G1HeapRegionSize=8M",
          "-XX:G1ReservePercent=20",
          "-XX:G1HeapWastePercent=5",
          "-XX:G1MixedGCCountTarget=4",
          "-XX:InitiatingHeapOccupancyPercent=15",
          "-XX:G1MixedGCLiveThresholdPercent=90",
          "-XX:G1RSetUpdatingPauseTimePercent=5",
          "-XX:SurvivorRatio=32",
          "-XX:+PerfDisableSharedMem",
          "-XX:MaxTenuringThreshold=1",
        );
      } else if (["velocity", "waterfall", "bungeecord"].includes(type)) {
        // PROXY FLAGS (Focadas em latência e processamento de pacotes)
        args.push(
          "-XX:+UseG1GC",
          "-XX:MaxGCPauseMillis=50",
          "-XX:+UnlockExperimentalVMOptions",
          "-XX:+AlwaysPreTouch",
          "-XX:G1HeapRegionSize=4M",
          "-XX:InitiatingHeapOccupancyPercent=15",
          "-XX:G1MixedGCCountTarget=4",
        );
      } else if (type === "nukkit") {
        // NUKKIT FLAGS (Leveza total com ZGC se disponível no Linux)
        args.push(
          "-XX:+AlwaysPreTouch",
          "-XX:+DisableExplicitGC",
          "-XX:MaxGCPauseMillis=20",
        );
      }

      args.push("-Dfile.encoding=UTF-8");

      if (fs.existsSync(runShPath)) {
        addLog(serverId, `[INFO] Usando script run.sh em vez de JAR direto...`);
        command = "sh";
        args = ["run.sh"];
      } else {
        const jarPath = path.resolve(srvDir, jarFile);
        args.push("-jar", jarPath, "nogui");
      }

      console.log(`[SPAWN] Executing: ${command} ${args.join(" ")}`);
      console.log(`[SPAWN] Working Directory: ${srvDir}`);

      if (command !== "sh" && command !== "java" && !fs.existsSync(command)) {
        throw new Error(`Comando de boot não encontrado em: ${command}`);
      }

      const child = spawn(command, args, {
        cwd: srvDir,
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, MALLOC_ARENA_MAX: "2" },
        shell: false,
      });

      child.on("error", (err) => {
        addLog(serverId, ` [ERROR] Erro ao iniciar processo: ${err.message}`);
        serversState[serverId].status = "offline";
      });

      child.stdout.on("data", (data) => {
        const msg = data.toString().trim();
        msg.split("\n").forEach((line) => {
          if (line.trim()) {
            addLog(serverId, line.trim());
            if (line.includes("Done") || line.includes("For help, type")) {
              serversState[serverId].status = "online";
            }

            // AI Error Listening
            if (/error|warn|exception|crash/i.test(line)) {
              const state = serversState[serverId] as any;
              if (!state.errorBuffer) state.errorBuffer = [];
              state.errorBuffer.push(line.trim());

              if (state.errorTimer) clearTimeout(state.errorTimer);
              state.errorTimer = setTimeout(async () => {
                const errors = state.errorBuffer.join("\n");
                state.errorBuffer = []; // clear

                const apiKey = process.env.GEMINI_API_KEY;
                if (apiKey && !apiKey.startsWith("AIza_fallback")) {
                  try {
                    const localAi = new GoogleGenAI({ apiKey });
                    const res = await localAi.models.generateContent({
                      model: "gemini-1.5-flash",
                      contents: `Como assistente técnico do Minecraft, o servidor encontrou os seguintes erros recentes nas logs:\n\n${errors}\n\nAnalise em 1 ou 2 frases curtas o que pode estar errado e dê a solução ou comando necessário. Você é um ajudante automático, responda com algo como "Problema detectado: [X]. Solução: [Y]". Dicas curtas são as melhores.`,
                    });
                    if (res.text) {
                      addLog(
                        serverId,
                        `[AI Auto-Fix] 💡 ${res.text.replace(/\n/g, " ")}`,
                      );
                    }
                  } catch (e) {}
                }
              }, 3000);
            }
          }
        });
      });

      child.stderr.on("data", (data) => {
        const msg = data.toString().trim();
        msg.split("\n").forEach((line) => {
          if (line.trim()) addLog(serverId, `[STDERR] ${line.trim()}`);
        });
      });

      child.on("close", (code) => {
        addLog(serverId, `Servidor parou (code ${code})`);
        serversState[serverId].status = "offline";
        delete serversState[serverId].process;
      });

      serversState[serverId].process = child;
      startGlobalTunnel();
    } catch (err: any) {
      addLog(serverId, ` [ERROR] Crash fatal: ${err.message}`);
      serversState[serverId].status = "offline";
    }
  });

  app.post("/api/server/stop", (req, res) => {
    const { serverId } = req.body;
    const srv = serversState[serverId];
    if (srv && srv.process) {
      srv.status = "stopping";
      srv.process.stdin.write("stop\n");
      // Fallback timeout
      setTimeout(() => {
        if (serversState[serverId]?.status === "stopping") {
          addLog(serverId, "[WARN] Parada demorada, enviando SIGTERM...");
          srv.process.kill();
        }
      }, 30000);
      res.json({ message: "Parando..." });
    } else res.status(400).json({ error: "Não está rodando." });
  });

  app.post("/api/server/kill", (req, res) => {
    const { serverId } = req.body;
    const srv = serversState[serverId];
    if (srv && srv.process) {
      srv.process.kill("SIGKILL");
      srv.status = "offline";
      addLog(serverId, "[DANGER] Processo finalizado forçadamente!");
      res.json({ message: "Killed" });
    } else res.status(400).json({ error: "Não encontrado." });
  });

  app.post("/api/server/clear-logs", (req, res) => {
    const { serverId } = req.body;
    if (serversState[serverId]) {
      serversState[serverId].logs = [];
    }
    res.json({ success: true });
  });

  app.post("/api/server/backup", (req, res) => {
    const { serverId } = req.body;
    ensureState(serverId);
    const srvDir = getServerDir(serverId);
    const backupDir = path.join(process.cwd(), "backups", serverId);
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const zipName = `backup-${timestamp}.tar.gz`;
    const dest = path.join(backupDir, zipName);

    addLog(serverId, `[BACKUP] Iniciando compressão do mundo...`);
    exec(`tar -czf "${dest}" -C "${srvDir}" .`, (err) => {
      if (err) addLog(serverId, `[ERROR] Backup falhou: ${err.message}`);
      else addLog(serverId, `[SUCCESS] Backup concluído: ${zipName}`);
    });
    res.json({ message: "Backup em progresso" });
  });

  app.post("/api/server/command", (req, res) => {
    const { serverId, command } = req.body;
    const srv = serversState[serverId];
    if (srv && srv.process) {
      try {
        srv.process.stdin.write(`${command}\n`);
        addLog(serverId, `> ${command}`);
        console.log(`[CONSOLE][${serverId}] Executed: ${command}`);
        res.json({ message: "Ok" });
      } catch (err: any) {
        addLog(serverId, `[ERROR] Falha ao enviar comando: ${err.message}`);
        res.status(500).json({ error: "Erro ao escrever no stdin." });
      }
    } else {
      res
        .status(400)
        .json({ error: "Servidor está offline. Ligue-o primeiro! (•◡•)" });
    }
  });

  app.post("/api/server/install", async (req, res) => {
    const { serverId, type, version, customUrl } = req.body;
    addLog(
      serverId,
      `[INSTALLER] Iniciando instalação de ${type === "custom" ? "Custom JAR" : type + " " + version}...`,
    );

    const getPaperUrl = async (project: string, ver: string) => {
      try {
        const vRes = await fetch(
          `https://api.papermc.io/v2/projects/${project}/versions/${ver}`,
        );
        const vData: any = await vRes.json();
        const latestBuild = vData.builds[vData.builds.length - 1];
        return `https://api.papermc.io/v2/projects/${project}/versions/${ver}/builds/${latestBuild}/downloads/${project}-${ver}-${latestBuild}.jar`;
      } catch (e) {
        return null;
      }
    };

    let url: string | null = "";
    let isFabric = type === "fabric";

    if (type === "paper") url = await getPaperUrl("paper", version);
    else if (type === "purpur")
      url = `https://api.purpurmc.org/v2/purpur/${version}/latest/download`;
    else if (type === "velocity") url = await getPaperUrl("velocity", version);
    else if (type === "waterfall")
      url = await getPaperUrl("waterfall", version);
    else if (isFabric) {
      try {
        const lRes = await fetch(
          "https://meta.fabricmc.net/v2/versions/loader",
        );
        const lData: any = await lRes.json();
        const latestLoader =
          lData.find((x: any) => x.stable)?.version || "0.16.5";
        url = `https://meta.fabricmc.net/v2/versions/loader/${version}/${latestLoader}/1.0.1/server/jar`;
      } catch (e) {
        url = `https://meta.fabricmc.net/v2/versions/loader/${version}/0.16.5/1.0.1/server/jar`;
      }
    } else if (type === "mohist") {
      try {
        const mRes = await fetch(
          `https://mohistmc.com/api/v2/projects/mohist/${version}/builds`,
        );
        const mData: any = await mRes.json();
        const latestBuild = mData.builds[mData.builds.length - 1];
        if (latestBuild && latestBuild.url) url = latestBuild.url;
      } catch (e) {
        url = null;
      }
    } else if (type === "forge") {
      try {
        const bRes = await fetch(
          `https://bmclapi2.bangbang93.com/forge/minecraft/${version}`,
        );
        const bData: any = await bRes.json();
        const sorted = bData.sort((a: any, b: any) => b.build - a.build);
        const forgeVer = sorted[0].version;
        url = `https://bmclapi2.bangbang93.com/forge/download?mcversion=${version}&version=${forgeVer}&category=installer&format=jar`;
      } catch (e) {
        url = null;
      }
    } else if (type === "vanilla") {
      try {
        const mRes = await fetch(
          "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json",
        );
        const mData: any = await mRes.json();
        const verEntry = mData.versions.find((v: any) => v.id === version);
        if (verEntry) {
          const vRes = await fetch(verEntry.url);
          const vData: any = await vRes.json();
          url = vData.downloads.server.url;
        }
      } catch (e) {
        url = null;
      }
    } else if (type === "spigot") {
      // Spigot doesn't have a direct official download API like others.
      // Use CDN from getbukkit
      url = `https://cdn.getbukkit.org/spigot/spigot-${version}.jar`;
    } else if (type === "bungeecord") {
      url =
        "https://ci.md-5.net/job/BungeeCord/lastStableBuild/artifact/bootstrap/target/BungeeCord.jar";
    } else if (type === "nukkit") {
      url =
        "https://ci.opencollab.dev/job/NukkitX/job/Nukkit/job/master/lastSuccessfulBuild/artifact/target/nukkit-1.0-SNAPSHOT.jar";
    } else if (type === "custom") url = customUrl;

    if (!url) {
      addLog(serverId, `[ERROR] URL não encontrada para ${type} ${version}`);
      return res.status(400).json({ error: "URL ou Software não suportado." });
    }

    const srvDir = getServerDir(serverId);
    const fileName =
      type === "custom"
        ? "server-custom.jar"
        : type === "forge"
          ? `forge-${version}-installer.jar`
          : type === "nukkit"
            ? `nukkit.jar`
            : `server-${type}-${version}.jar`;
    const dest = path.join(srvDir, fileName);

    try {
      if (fs.existsSync(srvDir)) {
        fs.readdirSync(srvDir).forEach((f) => {
          if (
            f.endsWith(".jar") ||
            f === "run.sh" ||
            f === "run.bat" ||
            f === "user_jvm_args.txt"
          )
            fs.unlinkSync(path.join(srvDir, f));
        });
      } else {
        fs.mkdirSync(srvDir, { recursive: true });
      }
    } catch (e) {}

    addLog(serverId, `[INSTALLER] Baixando de: ${url}`);

    exec(`curl --http1.1 -A "Mozilla/5.0" -L "${url}" -o "${dest}"`, (err) => {
      if (err) addLog(serverId, `[ERROR] Falha no download: ${err.message}`);
      else {
        if (type === "forge") {
          addLog(
            serverId,
            `[INSTALLER] Executando Forge Installer (isso pode demorar minutos)...`,
          );
          exec(
            `cd "${srvDir}" && "${JAVA_PATH}" -jar "${fileName}" --installServer`,
            (errInstall) => {
              if (fs.existsSync(dest)) fs.unlinkSync(dest); // Remove installer
              if (errInstall)
                addLog(
                  serverId,
                  `[ERROR] Forge Installer falhou: ${errInstall.message}`,
                );
              else {
                fs.writeFileSync(path.join(srvDir, "eula.txt"), "eula=true");
                addLog(
                  serverId,
                  `[SUCCESS] Forge ${version} instalado! Use START para ligar o servidor.`,
                );
              }
            },
          );
        } else {
          addLog(
            serverId,
            `[SUCCESS] ${type} ${version || ""} instalado com sucesso!`,
          );
          fs.writeFileSync(path.join(srvDir, "eula.txt"), "eula=true");
        }
      }
    });
    res.json({ message: "Download iniciado em segundo plano." });
  });

  // Helper to reliably download files using native Node fetch
  const downloadFile = async (url: string, dest: string, onLog?: (msg: string) => void): Promise<boolean> => {
    try {
      if (onLog) onLog(`[DOWNLOAD] Fetching from: ${url}`);
      const res = await fetch(url, { redirect: "follow" });
      if (!res.ok) {
        if (onLog) onLog(`[ERROR] HTTP ${res.status} ${res.statusText}`);
        return false;
      }
      
      const fileStream = fs.createWriteStream(dest);
      if (res.body) {
        // Node 18+ Web ReadableStream to Node stream
        // We can do it arrayBuffer for smaller files, or pipeline
        const ab = await res.arrayBuffer();
        fs.writeFileSync(dest, Buffer.from(ab));
        if (onLog) onLog(`[SUCCESS] Saved to ${path.basename(dest)}`);
        return true;
      }
      return false;
    } catch (e: any) {
      if (onLog) onLog(`[ERROR] Download falhou: ${e.message}`);
      return false;
    }
  };

  const getAddonsFolder = (serverId: string) => {
    const config = getSrvConfig(serverId);
    const type = (config.type || "paper").toLowerCase();
    if (["fabric", "forge", "mohist"].includes(type)) {
      return "mods";
    }
    return "plugins";
  };

  app.post("/api/server/plugins/install", async (req, res) => {
    const { serverId, url, name } = req.body;
    if (!url || !serverId)
      return res.status(400).json({ error: "Dados inválidos." });

    const folderName = getAddonsFolder(serverId);
    const pluginsDir = path.join(getServerDir(serverId), folderName);
    if (!fs.existsSync(pluginsDir))
      fs.mkdirSync(pluginsDir, { recursive: true });

    const fileName = name || `add-on-${Date.now()}.jar`;
    const dest = path.join(pluginsDir, fileName);

    await downloadFile(url, dest, (msg) => addLog(serverId, msg));

    res.json({ message: "Download de adicionais concluído." });
  });

  app.post("/api/server/download", async (req, res) => {
    const { serverId, url, destPath } = req.body;
    if (!url || !serverId)
      return res.status(400).json({ error: "Faltam parâmetros" });

    const fullPath = path.join(getServerDir(serverId), destPath || "");
    const dir = path.extname(fullPath) ? path.dirname(fullPath) : fullPath;

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const targetFile = path.extname(fullPath)
      ? fullPath
      : path.join(fullPath, path.basename(url));

    addLog(serverId, `[WEB] Iniciando download de: ${url}`);

    await downloadFile(url, targetFile, (msg) => addLog(serverId, msg));

    res.json({ success: true, message: "Download concluído." });
  });

  app.post("/api/servers/import-github", (req, res) => {
    const { url, serverId } = req.body;
    if (!url || !serverId)
      return res.status(400).json({ error: "URL ou ID faltando" });

    // Try to convert github URL to tar.gz URL (usually more reliable than zip in linux)
    let tarUrl = url.replace(/\/$/, "");
    if (!tarUrl.endsWith(".tar.gz")) {
      tarUrl = `${tarUrl}/archive/refs/heads/main.tar.gz`;
    }

    const srvDir = getServerDir(serverId);
    if (!fs.existsSync(srvDir)) fs.mkdirSync(srvDir, { recursive: true });

    const tarDest = path.join(srvDir, "repo.tar.gz");
    addLog(serverId, `[GITHUB] Iniciando importação de: ${url}`);
    addLog(serverId, `[GITHUB] Baixando código fonte (.tar.gz)...`);

    exec(
      `curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -L "${tarUrl}" -o "${tarDest}"`,
      (err) => {
        if (err) {
          // Fallback to master
          const fallbackUrl =
            url.replace(/\/$/, "") + "/archive/refs/heads/master.tar.gz";
          addLog(serverId, `[GITHUB] Falha na branch main, tentando master...`);
          exec(
            `curl -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" -L "${fallbackUrl}" -o "${tarDest}"`,
            (err2) => {
              if (err2) {
                addLog(
                  serverId,
                  `[ERROR] Falha ao baixar do GitHub: ${err2.message}`,
                );
              } else {
                extractAndCleanup(serverId, srvDir, tarDest);
              }
            },
          );
        } else {
          extractAndCleanup(serverId, srvDir, tarDest);
        }
      },
    );

    function extractAndCleanup(id: string, dir: string, tarPath: string) {
      addLog(id, `[GITHUB] Extraindo arquivos...`);
      exec(
        `tar -xzf "${tarPath}" -C "${dir}" --strip-components=1 && rm "${tarPath}"`,
        (err) => {
          if (err) {
            addLog(id, `[ERROR] Erro na extração: ${err.message}`);
            // Se falhou o strip-components (talvez repositório vazio ou estrutura inesperada), tenta simples
            exec(
              `tar -xzf "${tarPath}" -C "${dir}" && rm "${tarPath}"`,
              () => {},
            );
          } else {
            saveSrvConfig(id, {
              ...DEFAULT_CONFIG,
              name: id.charAt(0).toUpperCase() + id.slice(1),
            });
            addLog(
              id,
              `[SUCCESS] Servidor "${id}" importado com sucesso! Verifique os arquivos.`,
            );
          }
        },
      );
    }

    res.json({ message: "Importação iniciada em segundo plano." });
  });

  app.get("/api/meta", async (req, res) => {
    let versions = ["1.21.1", "1.20.4", "1.19.4", "1.18.2", "1.12.2"];
    const type = (req.query.type as string) || "paper";

    try {
      if (["paper", "velocity", "waterfall"].includes(type)) {
        const pRes = await fetch(`https://api.papermc.io/v2/projects/${type}`);
        const pData: any = await pRes.json();
        if (pData.versions) versions = pData.versions.reverse().slice(0, 50);
      } else if (type === "purpur") {
        const pRes = await fetch("https://api.purpurmc.org/v2/purpur");
        const pData: any = await pRes.json();
        if (pData.versions)
          versions = pData.versions
            .filter((v: string) => v.startsWith("1."))
            .reverse()
            .slice(0, 50);
      } else if (type === "fabric") {
        const fRes = await fetch("https://meta.fabricmc.net/v2/versions/game");
        const fData: any = await fRes.json();
        if (Array.isArray(fData))
          versions = fData
            .filter((x: any) => x.stable)
            .map((x: any) => x.version)
            .slice(0, 50);
      } else if (type === "mohist") {
        const mRes = await fetch("https://mohistmc.com/api/v2/projects/mohist");
        const mData: any = await mRes.json();
        if (mData.versions) versions = mData.versions.reverse();
      } else if (type === "forge") {
        const bRes = await fetch(
          "https://bmclapi2.bangbang93.com/forge/minecraft",
        );
        const bData: any = await bRes.json();
        if (Array.isArray(bData)) versions = bData.slice().reverse();
      } else if (type === "vanilla" || type === "spigot") {
        const vRes = await fetch(
          "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json",
        );
        const vData: any = await vRes.json();
        if (vData.versions) {
          versions = vData.versions
            .filter((v: any) => v.type === "release")
            .map((v: any) => v.id)
            .slice(0, 40);
        }
      } else if (type === "bungeecord") {
        const bRes = await fetch(
          "https://ci.md-5.net/job/BungeeCord/lastStableBuild/api/json",
        );
        const bData: any = await bRes.json();
        if (bData.number) versions = ["lastStableBuild", `#${bData.number}`];
        else versions = ["latest"];
      } else if (type === "nukkit") {
        versions = ["latest"];
      }
    } catch (e) {}

    res.json({
      systemMaxRam: Math.floor(os.totalmem() / 1024 / 1024 / 1024),
      links: [
        { label: "Documentação", url: "https://docs.papermc.io" },
        { label: "Modrinth", url: "https://modrinth.com" },
        { label: "Hangar", url: "https://hangar.papermc.io" },
        { label: "Playit.gg Status", url: "https://status.playit.gg/" },
      ],
      versions: versions,
    });
  });

  app.get("/api/playit/status", async (req, res) => {
    let globalTunnel = null;

    // Playit prints the claim URL every 10 seconds while waiting.
    // If it hasn't printed it in the last 25 seconds, it means it successfully connected.
    if (
      globalPlayitClaimUrl &&
      Date.now() - globalPlayitClaimLastSeen > 25000
    ) {
      globalPlayitClaimUrl = null;
    }

    const persistentConfig = path.join(process.cwd(), "playit.toml");
    const isLinked = fs.existsSync(persistentConfig);

    if (isLinked) {
      try {
        const fileContent = fs.readFileSync(persistentConfig, "utf8");
        const match = fileContent.match(/secret_key\s*=\s*"(.*)"/);
        if (match) {
          const fetchRes = await fetch(
            "https://api.playit.gg/v1/tunnels/list",
            {
              method: "POST",
              headers: {
                Authorization: "Agent-Key " + match[1],
                "Content-Type": "application/json",
              },
              body: "{}",
            },
          );
          const data: any = await fetchRes.json();
          if (data?.data?.tunnels && data.data.tunnels.length > 0) {
            const tunnel = data.data.tunnels[0];

            let domain = "";
            let port = "";

            if (tunnel.alloc && tunnel.alloc.data) {
              const data = tunnel.alloc.data;
              if (data.port_start !== undefined)
                port = data.port_start.toString();
              
              // Prioritize SRV domain (e.g. .joinmc.link) because it doesn't need a port, it's prettier for Java Edition
              if (data.assigned_srv) domain = data.assigned_srv;
              else if (data.assigned_domain) domain = data.assigned_domain;
              else if (data.ip_hostname) domain = data.ip_hostname;
            }

            if (!domain && tunnel.domain && tunnel.domain.domain) {
              domain = tunnel.domain.domain;
            }
            if (!domain && tunnel.custom_domain) {
              domain = tunnel.custom_domain;
            }
            if (!domain && tunnel.assigned_domain) {
              domain = tunnel.assigned_domain;
            }

            if (
              !port &&
              tunnel.public_allocations &&
              tunnel.public_allocations.length > 0
            ) {
              const alloc = tunnel.public_allocations[0].details;
              if (alloc.port) port = alloc.port.toString();
              if (alloc.port_start) port = alloc.port_start.toString();
              if (!domain)
                domain = alloc.auto_domain || alloc.ip_hostname || "";
            }

            // Verifica se é um túnel Bedrock (geralmente UDP)
            const isBedrock =
              tunnel.tunnel_type?.name?.toLowerCase().includes("bedrock") ||
              tunnel.port_type === "udp" ||
              port === "19132" ||
              tunnel.tunnel_type === "minecraft-bedrock";

            if (isBedrock && domain && port) {
              if (domain.includes(".ply.gg")) {
                globalTunnel = `💎 Bedrock: [${domain}] Porta: [${port}]`;
              } else {
                globalTunnel = `💎 Bedrock: [${domain}]`;
              }
            } else if (domain) {
              if (domain.includes(".ply.gg") && port) {
                globalTunnel = `${domain}:${port}`;
              } else {
                // joinmc.link, custom domains, etc don't need port suffix usually, but we check if we should add it
                globalTunnel = domain;
              }
            }

            if (
              !globalTunnel &&
              tunnel.connect_addresses &&
              tunnel.connect_addresses.length > 0
            ) {
              const addr = tunnel.connect_addresses.find(
                (a: any) => a.type === "auto",
              );
              if (addr) globalTunnel = addr.value.address;
            }
          }
        }
      } catch (e) {
        console.error(`[Playit API] Failed to fetch tunnel API:`, e);
      }
    }

    if (!globalTunnel && globalPlayitLogs) {
      for (let i = globalPlayitLogs.length - 1; i >= 0; i--) {
        const addressMatch = globalPlayitLogs[i].match(
          /([\w\-.]+\.(?:ply\.gg|playit\.gg|joinmc\.link)(?::\d+)?)/i,
        );
        if (addressMatch) {
          globalTunnel = addressMatch[1];
          break;
        }
      }
    }

    if (globalTunnel) {
      globalPlayitClaimUrl = null;
    }

    res.json({
      claimUrl: globalPlayitClaimUrl,
      installed: fs.existsSync(PLAYIT_PATH),
      logs: globalPlayitLogs || [],
      linked: isLinked,
      tunnel: globalTunnel,
      running: !!globalPlayitProcess,
    });
  });

  app.post("/api/playit/start", (req, res) => {
    if (!globalPlayitProcess) {
      startGlobalTunnel();
    }
    res.json({ success: true });
  });

  app.post("/api/playit/install", async (req, res) => {
    if (!fs.existsSync(PLAYIT_PATH)) {
      const playitUrl = `https://github.com/playit-cloud/playit-agent/releases/latest/download/${path.basename(PLAYIT_PATH)}`;
      exec(
        `curl -A "Mozilla/5.0" -L "${playitUrl}" -o "${PLAYIT_PATH}"`,
        (err) => {
          if (!err) {
            if (os.platform() !== "win32") {
              try {
                fs.chmodSync(PLAYIT_PATH, 0o755);
              } catch (e) {}
            }
            startGlobalTunnel();
            res.json({ success: true, message: "Baixado e instalado." });
          } else {
            res.status(500).json({ error: "Falha ao baixar." });
          }
        },
      );
    } else {
      startGlobalTunnel();
      res.json({ success: true });
    }
  });

  app.post("/api/playit/update", async (req, res) => {
    if (globalPlayitProcess) {
      try {
        globalPlayitProcess.kill();
      } catch (e) {}
      globalPlayitProcess = null;
    }
    try {
      if (fs.existsSync(PLAYIT_PATH)) fs.unlinkSync(PLAYIT_PATH);
    } catch (e) {}

    const playitUrl = `https://github.com/playit-cloud/playit-agent/releases/latest/download/${path.basename(PLAYIT_PATH)}`;
    exec(
      `curl -A "Mozilla/5.0" -L "${playitUrl}" -o "${PLAYIT_PATH}"`,
      (err) => {
        if (!err) {
          if (os.platform() !== "win32") {
            try {
              fs.chmodSync(PLAYIT_PATH, 0o755);
            } catch (e) {}
          }
          startGlobalTunnel();
          res.json({ success: true, message: "Atualizado com sucesso." });
        } else {
          res.status(500).json({ error: "Falha ao baixar atualização." });
        }
      },
    );
  });

  app.post("/api/playit/uninstall", (req, res) => {
    if (globalPlayitProcess) {
      try {
        globalPlayitProcess.kill();
      } catch (e) {}
      globalPlayitProcess = null;
    }
    try {
      if (fs.existsSync(PLAYIT_PATH)) fs.unlinkSync(PLAYIT_PATH);
      const persistentConfig = path.join(process.cwd(), "playit.toml");
      if (fs.existsSync(persistentConfig)) fs.unlinkSync(persistentConfig);
    } catch (e) {}
    res.json({ success: true });
  });

  app.post("/api/playit/stop", (req, res) => {
    if (globalPlayitProcess) {
      try {
        globalPlayitProcess.kill();
      } catch (e) {}
      globalPlayitProcess = null;
    }
    res.json({ success: true });
  });

  app.post("/api/playit/reset", (req, res) => {
    if (globalPlayitProcess) {
      try {
        globalPlayitProcess.kill();
      } catch (e) {}
      globalPlayitProcess = null;
    }

    try {
      const persistentConfig = path.join(process.cwd(), "playit.toml");
      if (fs.existsSync(persistentConfig)) fs.unlinkSync(persistentConfig);
    } catch (e) {}

    const resetProc = spawn(PLAYIT_PATH, ["reset"], { cwd: process.cwd() });
    resetProc.on("close", () => {
      globalPlayitClaimUrl = null;
      if (globalPlayitLogs) globalPlayitLogs.splice(0, globalPlayitLogs.length);
      if (globalPlayitLogs)
        globalPlayitLogs.push("Playit resetado. Reiniciando...");

      startGlobalTunnel();
      res.json({ success: true });
    });
  });

  // Modrinth API Integration
  app.get("/api/modrinth/search", async (req, res) => {
    const q = (req.query.q as string) || "";
    // facets: project_type can be mod or plugin
    // Let's just search everything matching the query and let the user filter, or we can search both
    try {
      const mRes = await fetch(
        `https://api.modrinth.com/v2/search?query=${encodeURIComponent(q)}&limit=20`,
      );
      const mData = await mRes.json();
      res.json(mData);
    } catch (e) {
      res.status(500).json({ error: "Modrinth Indisponível" });
    }
  });

  app.get("/api/modrinth/project/:slug", async (req, res) => {
    const slug = req.params.slug;
    try {
      const pRes = await fetch(`https://api.modrinth.com/v2/project/${slug}`);
      const pData = await pRes.json();
      const vRes = await fetch(
        `https://api.modrinth.com/v2/project/${slug}/version`,
      );
      const vData = await vRes.json();
      res.json({ project: pData, versions: vData });
    } catch (e) {
      res.status(500).json({ error: "Erro." });
    }
  });

  app.post("/api/server/modrinth/install", async (req, res) => {
    const { serverId, versionId } = req.body;
    try {
      const vRes = await fetch(
        `https://api.modrinth.com/v2/version/${versionId}`,
      );
      const vData = await vRes.json();
      const file = vData.files.find((f: any) => f.primary) || vData.files[0];
      if (!file)
        return res.status(404).json({ error: "Arquivo não encontrado." });

      const destFolder = path.join(getServerDir(serverId), "plugins"); // Or mods? We can use plugins for both or mods for both, typically Fabric uses mods/ and Mohist uses both mods/ and plugins/
      // wait, let's look at the software type if we can, but let's just default to 'plugins' if we don't know, or 'mods' based on something?
      // Actually, if we use plugins folder or mods folder... Let's just pass `folder` dynamically.
      const folderArg = req.body.folder || "plugins";
      const targetDir = path.join(getServerDir(serverId), folderArg);
      if (!fs.existsSync(targetDir))
        fs.mkdirSync(targetDir, { recursive: true });

      const destPath = path.join(targetDir, file.filename);
      await downloadFile(file.url, destPath, (msg) => addLog(serverId, msg));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Erro na instalação Modrinth" });
    }
  });

  // Hangar API Integration
  app.get("/api/hangar/search", async (req, res) => {
    const q = (req.query.q as string) || "";
    try {
      const hRes = await fetch(
        `https://hangar.papermc.io/api/v1/projects?q=${encodeURIComponent(q)}&limit=20`,
      );
      const hData = await hRes.json();
      res.json(hData);
    } catch (e) {
      res.status(500).json({ error: "Hangar Indisponível" });
    }
  });

  app.get("/api/hangar/project/:slug", async (req, res) => {
    const slug = req.params.slug;
    try {
      const pRes = await fetch(
        `https://hangar.papermc.io/api/v1/projects/${slug}`,
      );
      const pData = await pRes.json();
      const vRes = await fetch(
        `https://hangar.papermc.io/api/v1/projects/${slug}/versions?limit=1`,
      );
      const vData: any = await vRes.json();
      res.json({ ...pData, latest: vData.result?.[0] });
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar plugin" });
    }
  });

  app.post("/api/server/plugins/hangar-install", async (req, res) => {
    const { serverId, slug, version } = req.body;
    try {
      // Hangar doesn't provide a direct permanent download link in project meta easily without session,
      // but we can construct it or use their download endpoint if available.
      // Most common: https://hangar.papermc.io/api/v1/projects/{author}/{slug}/versions/{version}/PLATFORM/download
      const pRes = await fetch(
        `https://hangar.papermc.io/api/v1/projects/${slug}`,
      );
      const pData: any = await pRes.json();
      const author = pData.namespace.owner;

      const downloadUrl = `https://hangar.papermc.io/api/v1/projects/${author}/${pData.name}/versions/${version}/PAPER/download`;

      const folderArg = req.body.folder || "plugins";
      const targetDir = path.join(getServerDir(serverId), folderArg);
      if (!fs.existsSync(targetDir))
        fs.mkdirSync(targetDir, { recursive: true });

      const fileName = `${pData.name}-${version}.jar`;
      const dest = path.join(targetDir, fileName);

      addLog(
        serverId,
        `[HANGAR] Baixando ${pData.name} v${version} para /${folderArg}...`,
      );

      await downloadFile(downloadUrl, dest, (msg) => addLog(serverId, msg));
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Erro na instalação Hangar" });
    }
  });

  app.get("/api/server/plugins", async (req, res) => {
    const serverId = (req.query.serverId as string) || "default";
    try {
      const folderName = getAddonsFolder(serverId);
      const pluginsDir = path.join(getServerDir(serverId), folderName);
      if (!fs.existsSync(pluginsDir)) return res.json({ plugins: [] });
      const files = fs
        .readdirSync(pluginsDir)
        .filter((f) => f.endsWith(".jar"));

      // Simple heuristic for versions: name-version.jar
      const plugins = files.map((filename) => {
        const match = filename.match(/^(.+)-([\d.]+)\.jar$/);
        return {
          filename,
          name: match ? match[1] : filename.replace(".jar", ""),
          version: match ? match[2] : "unknown",
          folder: folderName,
        };
      });

      res.json({ plugins });
    } catch (e) {
      res.status(500).json({ error: "Erro." });
    }
  });

  app.get("/api/server/plugins/check-updates", async (req, res) => {
    const serverId = (req.query.serverId as string) || "default";
    try {
      const folderName = getAddonsFolder(serverId);
      const pluginsDir = path.join(getServerDir(serverId), folderName);
      if (!fs.existsSync(pluginsDir)) return res.json({ updates: [] });
      const files = fs
        .readdirSync(pluginsDir)
        .filter((f) => f.endsWith(".jar"));

      const updates = [];
      for (const file of files) {
        const match = file.match(/^(.+)-([\d.]+)\.jar$/);
        const name = match ? match[1] : null;
        const currentVersion = match ? match[2] : null;

        if (name && currentVersion) {
          try {
            const hRes = await fetch(
              `https://hangar.papermc.io/api/v1/projects/${name}/versions?limit=1`,
            );
            const hData: any = await hRes.json();
            const latestVersion = hData.result?.[0]?.name;
            if (latestVersion && latestVersion !== currentVersion) {
              updates.push({ name, currentVersion, latestVersion, file });
            }
          } catch (e) {}
        }
      }
      res.json({ updates });
    } catch (e) {
      res.status(500).json({ error: "Erro ao buscar atualizações" });
    }
  });

  app.get("/api/server/files/list", (req, res) => {
    const serverId = (req.query.serverId as string) || "default";
    const folder = (req.query.folder as string) || "";
    const safeBase = getServerDir(serverId);
    const targetDir = path.join(safeBase, folder);
    console.log(
      "[FILE LIST API] folder:",
      folder,
      "targetDir:",
      targetDir,
      "safeBase:",
      safeBase,
    );

    // Security check
    if (!targetDir.startsWith(safeBase))
      return res.status(403).json({ error: "Acesso proibido." });

    if (!fs.existsSync(targetDir))
      return res.status(404).json({ error: "Pasta não encontrada." });
    try {
      const items = fs.readdirSync(targetDir).map((name) => {
        const stats = fs.statSync(path.join(targetDir, name));
        return { name, isDirectory: stats.isDirectory(), size: stats.size };
      });
      res.json({ items });
    } catch (e) {
      res.status(500).json({ error: "Erro." });
    }
  });

  app.get("/api/server/files/content", (req, res) => {
    const serverId = (req.query.serverId as string) || "default";
    const filePath = req.query.path as string;
    const safeBase = getServerDir(serverId);
    const fullPath = path.join(safeBase, filePath);

    if (!fullPath.startsWith(safeBase))
      return res.status(403).json({ error: "Acesso proibido." });

    try {
      res.json({ content: fs.readFileSync(fullPath, "utf-8") });
    } catch (e) {
      res.status(500).json({ error: "Erro." });
    }
  });

  app.get("/api/server/files/download", (req, res) => {
    const serverId = (req.query.serverId as string) || "default";
    const filePath = req.query.path as string;
    const safeBase = getServerDir(serverId);
    const fullPath = path.join(safeBase, filePath);

    if (!fullPath.startsWith(safeBase) || !fs.existsSync(fullPath))
      return res.status(403).json({ error: "Acesso proibido ou arquivo não localizado." });

    res.download(fullPath);
  });

  app.post("/api/server/files/save", (req, res) => {
    const { serverId, path: filePath, content } = req.body;
    const safeBase = getServerDir(serverId);
    const fullPath = path.join(safeBase, filePath);

    if (!fullPath.startsWith(safeBase))
      return res.status(403).json({ error: "Acesso proibido." });

    try {
      fs.writeFileSync(fullPath, content);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Erro." });
    }
  });

  app.post("/api/server/files/mkdir", (req, res) => {
    const { serverId, path: folderPath } = req.body;
    const safeBase = getServerDir(serverId);
    const fullPath = path.join(safeBase, folderPath);

    if (!fullPath.startsWith(safeBase))
      return res.status(403).json({ error: "Acesso proibido." });

    try {
      if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Erro ao criar pasta." });
    }
  });

  app.delete("/api/server/files/delete", (req, res) => {
    const serverId = (req.query.serverId as string) || "default";
    const filePath = req.query.path as string;
    const safeBase = getServerDir(serverId);
    const fullPath = path.join(safeBase, filePath);

    if (!fullPath.startsWith(safeBase))
      return res.status(403).json({ error: "Acesso proibido." });

    try {
      if (fs.lstatSync(fullPath).isDirectory())
        fs.rmSync(fullPath, { recursive: true, force: true });
      else fs.unlinkSync(fullPath);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Erro." });
    }
  });

  app.post("/api/server/files/rename", (req, res) => {
    const { serverId, oldPath, newPath } = req.body;
    const safeBase = getServerDir(serverId);
    const fullOldPath = path.join(safeBase, oldPath);
    const fullNewPath = path.join(safeBase, newPath);

    if (!fullOldPath.startsWith(safeBase) || !fullNewPath.startsWith(safeBase))
      return res.status(403).json({ error: "Acesso proibido." });

    try {
      fs.renameSync(fullOldPath, fullNewPath);
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Erro ao renomear." });
    }
  });

  app.post("/api/server/delete", (req, res) => {
    const { serverId } = req.body;
    if (!serverId) return res.status(400).json({ error: "No ID" });
    ensureState(serverId);
    if (serversState[serverId].status !== "offline")
      return res.status(400).json({ error: "Pare o servidor!" });
    try {
      fs.rmSync(getServerDir(serverId), { recursive: true, force: true });
      delete serversState[serverId];
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Erro." });
    }
  });

  // Vite middleware for development
  app.post("/api/app/evaluate", async (req, res) => {
    try {
      const { code } = req.body;
      const result = await eval(`(async () => { ${code} })()`);
      res.json({ success: true, result });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/system/version", (req, res) => {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
      res.json({ version: pkg.version });
    } catch {
      res.json({ version: "Desconhecida" });
    }
  });

  app.post("/api/system/update", (req, res) => {
    try {
      res.json({ message: "Atualização iniciada. Reiniciando o servidor..." });

      const { exec } = require("child_process");
      const cmd =
        "git pull origin main || git pull origin master; npm install && npm run build";

      console.log("[System] Auto-update initiated from GitHub...");

      exec(cmd, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error("[System] Auto-update error:", error);
          return;
        }
        console.log("[System] Auto-update complete:\n" + stdout);
        console.log("[System] Atualização concluída. Se não voltar, use 'staper'.");
        process.exit(0); // Exiting process so it gets restarted by the environment/pm2
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/server/install-ai-core", (req, res) => {
    const { serverId } = req.body;
    const srvDir = getServerDir(serverId || "default");
    const pluginsDir = path.join(srvDir, "plugins");
    if (!fs.existsSync(pluginsDir))
      fs.mkdirSync(pluginsDir, { recursive: true });

    // We use skript 2.9.3 which is solid
    const skriptUrl =
      "https://github.com/SkriptLang/Skript/releases/download/2.9.3/Skript.jar";
    const dest = path.join(pluginsDir, "Skript.jar");
    addLog(serverId || "default", "[AI] Configurando superpoderes (Skript)...");

    exec(`curl -L "${skriptUrl}" -o "${dest}"`, (err) => {
      if (err) {
        addLog(
          serverId || "default",
          `[ERROR] Falha ao instalar AI Core: ${err.message}`,
        );
        res.status(500).json({ error: err.message });
      } else {
        addLog(
          serverId || "default",
          `[SUCCESS] Superpoderes IA ativados (Skript instalado)! Se o server estiver online, use /reload ou reinicie.`,
        );
        res.json({ success: true });
      }
    });
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
