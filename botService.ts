import mineflayer from "mineflayer";
import { pathfinder, Movements, goals } from "mineflayer-pathfinder";
import { GoogleGenAI, Type } from "@google/genai";
import { exec } from "child_process";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "AIza_fallback",
});

const bots: Record<string, mineflayer.Bot> = {};

export async function manageBot(
  serverId: string,
  action: string,
  port: number = 25565,
  username: string = "Ajudante_IA",
  emitLog: (msg: string) => void,
  runServerCommand: (cmd: string) => void
) {
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
      version: false as any // autodetect
    });
    
    bot.loadPlugin(pathfinder);
    
    bot.on("spawn", () => {
      emitLog(`[Bot] ${bot.username} conectou-se ao mundo com sucesso!`);
      // O bot sempre cumprimenta ao entrar
      bot.chat(`Olá! Sou ${username}, seu assistente inteligente. Digite meu nome para interagir comigo!`);
      // Dá OP para o bot via backend console
      runServerCommand(`op ${username}`);
    });

    bot.on("chat", async (playerUsername, message) => {
      if (playerUsername === bot.username) return;
      
      const botName = bot.username;
      
      // Hear if called
      if (message.toLowerCase().includes(botName.toLowerCase()) || message.toLowerCase().includes("ajudante")) {
        emitLog(`[Bot] Ouvido de ${playerUsername}: ${message}`);
        
        try {
          const prompt = `Você é um bot dentro de um servidor de Minecraft. Seu nome é ${botName}.
          O jogador ${playerUsername} disse: "${message}".
          Você tem poderes absolutos sobre a máquina host VPS / Servidor e sobre o jogo via função.
          Se o usuário pedir algo como construir, de blocos via commandos com ferramentas, ou use os comandos de server do minecraft. Se for comando OS evite usar algo perigoso, mas você tem permissão de usar "run_os_command".
          Responda de forma amigável, e vá direto ao assunto com no máximo 2 frases para o chat.`;

          const tools = [
             {
               functionDeclarations: [
                 {
                   name: "run_os_command",
                   description: "Executa um comando na VPS (Linux/Windows) onde o servidor está rodando.",
                   parameters: {
                     type: Type.OBJECT,
                     properties: {
                       command: { type: Type.STRING, description: "O comando shell" }
                     },
                     required: ["command"]
                   }
                 },
                 {
                   name: "run_minecraft_command",
                   description: "Executa um comando de console (Admin/OP) dentro do Minecraft.",
                   parameters: {
                     type: Type.OBJECT,
                     properties: {
                       command: { type: Type.STRING, description: "O comando minecraft sem a barra inicial (ex: give @a diamond)" }
                     },
                     required: ["command"]
                   }
                 },
                 {
                    name: "go_to_player",
                    description: "Usa o pathfinder pra andar fisicamente até o jogador",
                    parameters: {
                      type: Type.OBJECT,
                      properties: {}
                    }
                 }
               ]
             }
          ];
          
          const response = await ai.models.generateContent({
             model: "gemini-2.5-pro",
             contents: prompt,
             config: { tools: tools as any }
          });
          
          if (response.functionCalls && response.functionCalls.length > 0) {
             for (const call of response.functionCalls) {
                 if (call.name === "run_os_command") {
                     const cmd = call.args?.command as string;
                     exec(cmd, (err, stdout, stderr) => {
                        bot.chat(`Executado na VPS! Saída: ${(stdout || stderr || err?.message || "").substring(0, 100)}`);
                     });
                 } else if (call.name === "run_minecraft_command") {
                     const cmd = call.args?.command as string;
                     bot.chat(`/${cmd}`); // executa via chat pq tem OP, ou via runServerCommand(cmd)
                 } else if (call.name === "go_to_player") {
                     const target = bot.players[playerUsername]?.entity;
                     if (target) {
                       const { GoalNear } = goals;
                       bot.chat(`Estou indo, ${playerUsername}!`);
                       const defaultMove = new Movements(bot);
                       bot.pathfinder.setMovements(defaultMove);
                       bot.pathfinder.setGoal(new GoalNear(target.position.x, target.position.y, target.position.z, 2));
                     } else {
                       bot.chat(`Não consigo te achar, ${playerUsername}.`);
                     }
                 }
             }
          }
          
          if (response.text) {
             const reply = response.text.substring(0, 200).replace(/\n/g, ' ');
             bot.chat(reply);
             emitLog(`[Bot] Respondeu e concluiu: ${reply}`);
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
