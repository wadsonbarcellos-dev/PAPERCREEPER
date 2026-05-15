/// <reference types="vite/client" />

import { GoogleGenAI } from "@google/genai";
import { withResilience } from "./resilience";
import { measurePerformanceAsync } from "./telemetry";
import { AIProvider } from "./aiProvider";
import { GeminiClientProvider } from "./providers/GeminiClientProvider";
import { ServerProxyProvider } from "./providers/ServerProxyProvider";

// Factory/Strategy selector

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
  return await measurePerformanceAsync("ai-request", async () => 
    await withResilience(async () => {
        let aiProvider: AIProvider;
    
        if (provider === "gemini" && apiKeys && apiKeys[0] && apiKeys[0] !== "AIza_fallback") {
            aiProvider = new GeminiClientProvider(apiKeys[0], modelName || "gemini-3-flash-preview");
        } else {
            // Fallback to server proxy
            aiProvider = new ServerProxyProvider(endpoint || "/api/ai", { serverId, provider, modelName, apiKeys, options });
        }
        
        return await aiProvider.ask(prompt, context || "", history || [], onChunk);
      }, { 
        text: `Erro ao conectar com a IA: Serviço indisponível temporariamente.`
      })
  );
};
