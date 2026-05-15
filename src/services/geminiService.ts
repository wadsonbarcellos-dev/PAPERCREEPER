/// <reference types="vite/client" />

import { GoogleGenAI } from "@google/genai";
import { withResilience } from "./resilience";

export const askAI = async (
  prompt: string, 
  context?: string, 
  serverId?: string,
  provider?: string,
  endpoint?: string,
  history?: any[],
  modelName?: string,
  apiKeys?: string[],
  options?: any,
  onChunk?: (text: string) => void
) => {
  return await withResilience(async () => {
    // Native Gemini Client-side handling for "pro" experience and AI Studio compatibility
    if (provider === "gemini") {
      const apiKey = (apiKeys && apiKeys.length > 0) ? apiKeys[0] : (process.env.GEMINI_API_KEY || "");
      
      // If we have a key, try client-side first
      if (apiKey && apiKey !== "AIza_fallback") {
        try {
          const systemInstruction = `Você é o "PaperCreeper AI", o OPERADOR SUPREMO e ENGENHEIRO de servidores Minecraft.
Personality: Técnico, eficiente, prestativo e com um toque de humor "Minecrafter". Use emojis como ⛏️, 💎, 🔥, 🧨, 🛡️.

CAPACIDADES: Você pode sugerir e realizar ações técnicas no servidor inclusive ferramentas [ACTION:{"name": "...", "args": {...}}].`;
          const ai = new GoogleGenAI({ apiKey });
          
          const contents = history ? history.map(h => ({
            role: h.role === "assistant" ? "model" as const : "user" as const,
            parts: [{ text: h.text }]
          })) : [];
          
          const finalMsg = context ? `CONTEXTO:\n${context}\n\nPERGUNTA: ${prompt}` : prompt;
          contents.push({ role: "user", parts: [{ text: finalMsg }] });

          if (onChunk) {
            const stream = await ai.models.generateContentStream({
              model: modelName || "gemini-3-flash-preview",
              contents,
              config: { systemInstruction, temperature: 0.7 }
            });
            
            let fullText = "";
            for await (const chunk of stream) {
              if (chunk.text) {
                fullText += chunk.text;
                onChunk(fullText);
              }
            }
            return { text: fullText };
          } else {
            const response = await ai.models.generateContent({
              model: modelName || "gemini-3-flash-preview",
              contents,
              config: { systemInstruction, temperature: 0.7 }
            });
            return { text: response.text || "" };
          }
        } catch (clientError) {
          console.warn("Client-side Gemini failed, falling back to server:", clientError);
          // fall through to server-side fetch
        }
      }
    }

    if (onChunk) {
      const response = await fetch("/api/ai/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, context, serverId, provider, endpoint, history, modelName, apiKeys, options })
      });

      if (!response.ok) {
        throw new Error(`Erro no servidor: ${response.status}`);
      }

      if (!response.body) throw new Error("Sem body na resposta");
      
      const contentType = response.headers.get("content-type");
      let fullText = "";
      if (contentType && contentType.includes("application/json")) {
         const data = await response.json();
         if (data.error) {
            fullText = "❌ Erro: " + data.error;
            onChunk(fullText);
            return { text: fullText, error: data.error };
         }
         fullText = data.text || "";
         onChunk(fullText);
         return { text: fullText, call: data.call };
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = "";
      
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
        }
        
        if (done) {
           buffer += decoder.decode();
           if (buffer.length > 0) {
              buffer += "\n"; // Force process last line
           }
        }
        
        if (buffer.includes("\n")) {
           const lines = buffer.split("\n");
           buffer = lines.pop() || "";
           for (const line of lines) {
              let dataStr = "";
              if (line.trim().startsWith("data: ")) {
                 dataStr = line.trim().substring(6).trim();
              } else if (line.trim().startsWith("{") && line.trim().endsWith("}")) {
                 dataStr = line.trim();
              }
              if (dataStr === "[DONE]") continue;
              if (dataStr) {
                 try {
                    const data = JSON.parse(dataStr);
                    if (data.error) { const errText = typeof data.error === 'string' ? data.error : JSON.stringify(data.error); fullText += '\n❌ Erro: ' + errText; onChunk(fullText); break; }
                    const content = data.choices ? (data.choices[0].delta?.content || data.choices[0].message?.content || "") : "";
                    if (content) {
                       fullText += content;
                       onChunk(fullText);
                    }
                 } catch(e) {}
              }
           }
        }
      }
      
      let call = null;

      // Remove chain of thought blocks if any (e.g. DeepSeek-R1 <think>...</think>)
      const textToTest = fullText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

      const actionRegex = /\[ACTION:\s*({[\s\S]+?})\s*]/i;
      const actionMatch = textToTest.match(actionRegex);
      if (actionMatch) {
         try {
            let jsonStr = actionMatch[1].trim();
            jsonStr = jsonStr.replace(/```json/gi, "").replace(/```/g, "").trim();
            call = JSON.parse(jsonStr);
            fullText = fullText.replace(actionMatch[0], "").trim();
         } catch(e) {}
      }

      if (!call) {
         const pesquisarMatch = textToTest.match(/<call:PESQUISAR>(.*?)<\/call>/i);
         if (pesquisarMatch) {
            call = { name: "searchInternet", args: { query: pesquisarMatch[1].trim() } };
            fullText = fullText.replace(pesquisarMatch[0], "").trim();
         } else {
            const consultarMatch = textToTest.match(/<call:CONSULTAR>(.*?)<\/call>/i);
            if (consultarMatch) {
               call = { name: "readMemory", args: { query: consultarMatch[1].trim() } };
               fullText = fullText.replace(consultarMatch[0], "").trim();
            } else {
               const genericCallMatch = textToTest.match(/<call:([A-Za-z0-9_]+)>(.*?)<\/call>/s);
               if (genericCallMatch) {
                   call = { name: genericCallMatch[1].trim(), args: { command: genericCallMatch[2].trim() } };
                   fullText = fullText.replace(genericCallMatch[0], "").trim();
               }
            }
         }
      }
      
      return { text: fullText, call };
    }

    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context, serverId, provider, endpoint, history, modelName, apiKeys, options })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: "Erro no servidor" }));
      throw new Error(errData.error || "Servidor de IA inacessível");
    }

    const result = await response.json();
    return { text: result.text, call: result.call };
  }, { 
    text: `Erro ao conectar com a IA: Serviço indisponível temporariamente. 
           Dica: Certifique-se de que a Chave de API está configurada na aba de Configurações! 🔌`
  });
};
