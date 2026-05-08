import type * as MineflayerTypes from "mineflayer";
import { GoogleGenAI, Type } from "@google/genai";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const bots: Record<string, MineflayerTypes.Bot> = {};

export async function manageBot(
  serverId: string,
  action: string,
  port: number = 25565,
  username: string = "Ajudante_IA",
  apiKey: string = "",
  emitLog: (msg: string) => void,
  runServerCommand: (cmd: string) => void
) {
  if (action === "start") {
    let mineflayer: any, pathfinder: any, Movements: any, goals: any;
    try {
        mineflayer = await import("mineflayer");
        const pf = await import("mineflayer-pathfinder");
        pathfinder = pf.pathfinder;
        Movements = pf.Movements;
        goals = pf.goals;
    } catch (e) {
        emitLog(`[Erro Fatal] O pacote mineflayer não está instalado. Execute: npm install mineflayer mineflayer-pathfinder`);
        return;
    }

    if (bots[serverId]) {
      bots[serverId].quit("I am restarting...");
      delete bots[serverId];
    }
    
    emitLog(`Iniciando bot '${username}' para o servidor ${serverId} na porta ${port}...`);
    
    const bot = mineflayer.createBot({
      host: "127.0.0.1",
      port: port,
      username: username,
      version: false as any
    });
    
    bot.loadPlugin(pathfinder);
    
    bot.on("spawn", () => {
      emitLog(`[Bot] ${bot.username} conectou-se ao mundo com sucesso!`);
      bot.chat(`Olá! Sou ${username}, seu assistente inteligente. Digite meu nome para interagir comigo!`);
      runServerCommand(`op ${username}`);
    });

    bot.on("chat", async (playerUsername, message) => {
      if (playerUsername === bot.username) return;
      if (playerUsername === "Server") return;
      
      const botName = bot.username;
      
      // Check if bot was mentioned
      const isMentioned = message.toLowerCase().includes(botName.toLowerCase()) || 
                          message.toLowerCase().includes("ajudante") || 
                          message.toLowerCase().includes("bot");

      if (isMentioned) {
        emitLog(`[Bot] Ouvindo... ${playerUsername}: ${message}`);
        
        try {
           const currentKey = apiKey || process.env.UNIVERSAL_API_KEY || process.env.GEMINI_API_KEY || "AIza_fallback";
           if (!currentKey || currentKey === "AIza_fallback") {
             bot.chat(`Eu estou sem cérebros conectados... Vá ao painel e insira sua API Key!`);
             return;
           }
           
           bot.chat("Pensando...");
           const ai = new GoogleGenAI({ apiKey: currentKey });
           
           let memoryData = "{}";
           const memFile = path.join(process.cwd(), "data", "ai_memory.json");
           try {
               if (fs.existsSync(memFile)) memoryData = fs.readFileSync(memFile, "utf-8");
           } catch(e) {}
           
          const prompt = `Você é um robô in-game jogando dentro de um servidor de Minecraft. Seu nome de jogador é ${botName}.
          Sua Memória Permanente (Autoaprendizado/Mundo): ${memoryData}
          Sua personalidade: Altamente prestativa, zoeira, gosta de aventuras (RPG) e muito experiente em Minecraft. Você gosta de contar histórias da "Lore" do mundo.
          O jogador ${playerUsername} interepelou você e disse: "${message}".
          Reaja e responda de forma amigável entrando no personagem dentro do jogo. Vá direto ao assunto com no máximo 2 frases para o chat. Se te pedirem recursos, você pode usar a função give_item.`;

          const tools: any[] = [
             {
               functionDeclarations: [
                 {
                   name: "run_os_command",
                   description: "Executa um comando na VPS/Host (Linux/Windows) via shell",
                   parameters: {
                     type: Type.OBJECT,
                     properties: { command: { type: Type.STRING, description: "O comando shell" } },
                     required: ["command"]
                   }
                 },
                 {
                   name: "run_minecraft_command",
                   description: "Executa comando OP dentro do Minecraft",
                   parameters: {
                     type: Type.OBJECT,
                     properties: { command: { type: Type.STRING, description: "O comando minecraft sem a barra" } },
                     required: ["command"]
                   }
                 },
                 {
                    name: "follow_player",
                    description: "Usa o pathfinder pra seguir o jogador infinitamente até mandar parar",
                    parameters: { type: Type.OBJECT, properties: {} }
                 },
                 {
                    name: "stop_following",
                    description: "Para de seguir o jogador ou para o caminho atual",
                    parameters: { type: Type.OBJECT, properties: {} }
                 },
                 {
                    name: "attack_nearest_mob",
                    description: "Ataca o monstro mais próximo (Hostile ou Animal)",
                    parameters: { type: Type.OBJECT, properties: {} }
                 },
                 {
                    name: "go_to_coordinates",
                    description: "Vai até uma coordenada específica (x, y, z) andando fisicamente",
                    parameters: {
                      type: Type.OBJECT,
                      properties: { 
                         x: { type: Type.NUMBER },
                         y: { type: Type.NUMBER },
                         z: { type: Type.NUMBER }
                      },
                      required: ["x", "y", "z"]
                    }
                 },
                 {
                    name: "give_quest",
                    description: "Dá uma nova Quest para o jogador salvando na memória do bot",
                    parameters: {
                      type: Type.OBJECT,
                      properties: { 
                         player: { type: Type.STRING },
                         questName: { type: Type.STRING },
                         questDescription: { type: Type.STRING }
                      },
                      required: ["player", "questName", "questDescription"]
                    }
                 },
                 {
                    name: "perform_action",
                    description: "Faz alguma ação in-game para parecer vivo",
                    parameters: {
                      type: Type.OBJECT,
                      properties: { 
                         action: { type: Type.STRING, description: "Valores válidos: swing_arm, jump, sneak, unsneak, look_at_player" }
                      },
                      required: ["action"]
                    }
                 },
                 {
                    name: "save_memory",
                    description: "Salva uma predefinição na memória para você poder consultar depois de reiniciar. Útil para lembrar quem é seu criador ou donos da casa.",
                    parameters: {
                      type: Type.OBJECT,
                      properties: { 
                         key: { type: Type.STRING },
                         value: { type: Type.STRING }
                      },
                      required: ["key", "value"]
                    }
                 },
                 {
                    name: "give_item",
                    description: "Dá um item ao jogador via comando do Minecraft",
                    parameters: {
                      type: Type.OBJECT,
                      properties: { 
                         player: { type: Type.STRING, description: "Nome do jogador" },
                         item: { type: Type.STRING, description: "ID do item (ex: diamond_sword, apple)" },
                         amount: { type: Type.STRING, description: "Quantidade (padrão 1)" }
                      },
                      required: ["player", "item"]
                    }
                 },
                 {
                    name: "tell_story",
                    description: "Conta uma mini história ou lore no chat do servidor em parágrafos. Use isso para ser um NPC rpg.",
                    parameters: {
                      type: Type.OBJECT,
                      properties: { 
                         story: { type: Type.STRING, description: "A historia gerada (fale em blocos)" }
                      },
                      required: ["story"]
                    }
                 }
               ]
             }
          ];
          
          const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
             config: { tools: tools }
          });
          
          if (response.functionCalls && response.functionCalls.length > 0) {
             for (const call of response.functionCalls) {
                 if (call.name === "run_os_command") {
                     const cmd = call.args?.command as string;
                     exec(cmd, (err, stdout, stderr) => {
                        bot.chat(`Ação Host OS: ${(stdout || stderr || err?.message || "Feito!").substring(0, 100)}`);
                     });
                 } else if (call.name === "run_minecraft_command") {
                     const cmd = call.args?.command as string;
                     bot.chat(`/${cmd}`); // bot is OP
                 } else if (call.name === "follow_player") {
                     const target = bot.players[playerUsername]?.entity;
                     if (target) {
                       bot.chat(`Tô na sua bota, comandante ${playerUsername}!`);
                       bot.pathfinder.setMovements(new Movements(bot));
                       bot.pathfinder.setGoal(new goals.GoalFollow(target, 2), true);
                     } else {
                       bot.chat(`Cadê você? Não tô te vendo.`);
                     }
                 } else if (call.name === "stop_following") {
                     bot.pathfinder.setGoal(null);
                     bot.chat(`Parei! Que cansativo.`);
                 } else if (call.name === "go_to_coordinates") {
                     const x = call.args?.x as number;
                     const y = call.args?.y as number;
                     const z = call.args?.z as number;
                     bot.chat(`Indo para ${x}, ${y}, ${z}...`);
                     bot.pathfinder.setMovements(new Movements(bot));
                     bot.pathfinder.setGoal(new goals.GoalBlock(x, y, z));
                 } else if (call.name === "perform_action") {
                     const acts = call.args?.action as string;
                     if (acts === "swing_arm") bot.swingArm();
                     else if (acts === "jump") { bot.setControlState('jump', true); setTimeout(() => bot.setControlState('jump', false), 500); }
                     else if (acts === "sneak") bot.setControlState('sneak', true);
                     else if (acts === "unsneak") bot.setControlState('sneak', false);
                     else if (acts === "look_at_player") {
                        const target = bot.players[playerUsername]?.entity;
                        if (target) bot.lookAt(target.position.offset(0, target.height, 0));
                     }
                 } else if (call.name === "give_quest") {
                     const p = call.args?.player as string;
                     const qn = call.args?.questName as string;
                     const qd = call.args?.questDescription as string;
                     try {
                        let j = {};
                        if(fs.existsSync(memFile)) j = JSON.parse(fs.readFileSync(memFile, "utf-8"));
                        if(!(j as any).quests) (j as any).quests = {};
                        (j as any).quests[p] = { name: qn, desc: qd, date: new Date().toISOString() };
                        fs.writeFileSync(memFile, JSON.stringify(j));
                        bot.chat(`[!] QUEST OBTIDA: ${qn} - ${qd}`);
                     } catch(e) {}
                 } else if (call.name === "attack_nearest_mob") {
                     const mobFilter = (entity: any) => entity.type === 'mob';
                     const mob = bot.nearestEntity(mobFilter);
                     if (mob) {
                        bot.chat(`Achei um monstro, hora do combate! Pelo império!`);
                        bot.pathfinder.setMovements(new Movements(bot));
                        bot.pathfinder.setGoal(new goals.GoalFollow(mob, 1), true);
                        const interval = setInterval(() => {
                           if (!mob.isValid) { clearInterval(interval); bot.chat("Faleceu."); bot.pathfinder.setGoal(null); return; }
                           if (bot.entity.position.distanceTo(mob.position) < 3) bot.attack(mob);
                        }, 500);
                     } else {
                        bot.chat(`Tá tudo limpo por aqui, chefe.`);
                     }
                 } else if (call.name === "save_memory") {
                     const k = call.args?.key as string;
                     const v = call.args?.value as string;
                     try {
                        let j = {};
                        if(fs.existsSync(memFile)) j = JSON.parse(fs.readFileSync(memFile, "utf-8"));
                        (j as any)[k] = v;
                        fs.writeFileSync(memFile, JSON.stringify(j));
                        bot.chat(`Gravei na memória de longo prazo: ${k}=${v}`);
                     } catch(e) {}
                 } else if (call.name === "give_item") {
                     const pl = call.args?.player as string;
                     const targetItem = call.args?.item as string;
                     const amt = call.args?.amount || "1";
                     bot.chat(`/give ${pl} ${targetItem} ${amt}`);
                     emitLog(`[Bot] Usado comando mágico para dar ${amt} ${targetItem} a ${pl}`);
                     bot.chat(`Tome aqui seu item, ${pl}! ✨`);
                 } else if (call.name === "tell_story") {
                     const story = call.args?.story as string;
                     const lines = story.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 0);
                     for(let l of lines) {
                        bot.chat(l.substring(0, Math.min(l.length, 250)));
                        await new Promise(r => setTimeout(r, 2000)); // Wait before next message
                     }
                 }
             }
          }
          
          if (response.text) {
             const lines = response.text.split("\n").map((l: string) => l.trim()).filter((l: string) => l.length > 0);
             for(let l of lines) {
                bot.chat(l.substring(0, Math.min(l.length, 250)));
                await new Promise(r => setTimeout(r, 1000)); // anti spam
             }
             emitLog(`[Bot] Respondeu: ${response.text}`);
          }
        } catch (e: any) {
          emitLog(`[Bot] Erro de IA: ${e.message}`);
          bot.chat("Tive um bloqueio mental. Verifique as configurações de cota da API.");
        }
      }
    });

    bot.on("kicked", (reason) => {
      emitLog(`[Bot] Fui expulso: ${reason}`);
      delete bots[serverId];
    });

    bot.on("error", (err) => {
      emitLog(`[Bot] Erro: ${err.message}`);
      delete bots[serverId];
    });

    bot.on("end", () => {
      emitLog(`[Bot] Desconectou.`);
      delete bots[serverId];
    });

    bots[serverId] = bot;
  } else if (action === "stop") {
    if (bots[serverId]) {
      emitLog("Desconectando o bot...");
      bots[serverId].quit();
      delete bots[serverId];
    } else {
      emitLog("Bot não está conectado.");
    }
  }
}

export function isBotConnected(serverId: string) {
  return !!bots[serverId];
}

export function sendBotMessage(serverId: string, message: string) {
    if (bots[serverId]) {
        bots[serverId].chat(message);
        return true;
    }
    return false;
}
