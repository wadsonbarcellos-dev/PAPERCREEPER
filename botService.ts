import mineflayer from "mineflayer";
import { pathfinder, Movements, goals } from "mineflayer-pathfinder";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "AIza_fallback",
});

const bots: Record<string, mineflayer.Bot> = {};

export async function manageBot(serverId: string, action: string, port: number = 25565, username: string = "Ajudante_IA", emitLog: (msg: string) => void) {
  if (action === "start") {
    if (bots[serverId]) {
      emitLog("O bot já está conectado ao servidor!");
      return;
    }
    
    emitLog(`Iniciando bot '${username}' para o servidor ${serverId} na porta ${port}...`);
    
    const bot = mineflayer.createBot({
      host: "127.0.0.1",
      port: port,
      username: username,
      version: false // autodetect
    });
    
    bot.loadPlugin(pathfinder);
    
    bot.on("spawn", () => {
      emitLog(`[Bot] ${bot.username} conectou-se ao mundo com sucesso!`);
      // O bot sempre cumprimenta ao entrar
      bot.chat(`Olá! Sou ${username}, seu assistente inteligente. Digite meu nome para interagir comigo!`);
    });

    bot.on("chat", async (username, message) => {
      if (username === bot.username) return;
      
      const botName = bot.username;
      
      // Hear if called
      if (message.toLowerCase().includes(botName.toLowerCase()) || message.toLowerCase().includes("ajudante")) {
        emitLog(`[Bot] Ouvido de ${username}: ${message}`);
        
        try {
          const prompt = `Você é um bot dentro de um servidor de Minecraft. Seu nome é ${botName}.
          O jogador ${username} disse: "${message}".
          Responda de forma amigável, curta e útil, no máximo 2 frases curtas (MUITO IMPORTANTE para não floodar o chat).
          Inicie sua resposta sem aspas ou prefixos estranhos, vá direto ao assunto.`;
          
          const response = await ai.models.generateContent({
             model: "gemini-2.5-flash",
             contents: prompt,
          });
          
          if (response.text) {
             const reply = response.text.substring(0, 200).replace(/\n/g, ' ');
             bot.chat(reply);
             emitLog(`[Bot] Respondeu: ${reply}`);
             
             // Simple basic logic for tasks (moving)
             if (message.toLowerCase().includes("vem") || message.toLowerCase().includes("aqui") || message.toLowerCase().includes("tp")) {
               const target = bot.players[username]?.entity;
               if (target) {
                 const { GoalNear } = goals;
                 bot.chat(`Estou indo, ${username}!`);
                 const mcData = require('minecraft-data')(bot.version);
                 const defaultMove = new Movements(bot, mcData);
                 bot.pathfinder.setMovements(defaultMove);
                 bot.pathfinder.setGoal(new GoalNear(target.position.x, target.position.y, target.position.z, 2));
               } else {
                 bot.chat(`Não consigo te achar, ${username}.`);
               }
             }
          }
        } catch (e: any) {
          emitLog(`[Bot] Erro de IA: ${e.message}`);
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
