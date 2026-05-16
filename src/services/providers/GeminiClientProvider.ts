// src/services/providers/GeminiClientProvider.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AIProvider, AIResponse } from "../aiProvider";

export class GeminiClientProvider implements AIProvider {
  constructor(private apiKey: string, private modelName: string) {}

  async ask(prompt: string, context?: string, history?: any[], onChunk?: (text: string) => void): Promise<AIResponse> {
    const ai = new GoogleGenerativeAI(this.apiKey);
    const model = ai.getGenerativeModel({ model: this.modelName || "gemini-1.5-flash" });
    
    const chatHistory = history ? history.map(h => ({
      role: h.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: h.text }]
    })) : [];

    const systemText = 'Você é o "PaperCreeper AI", OPERADOR SUPREMO e ENGENHEIRO de servidores Minecraft. Use emojis.';
    const finalPrompt = context ? `CONTEXTO:\n${context}\n\nPERGUNTA: ${prompt}` : prompt;

    if (onChunk) {
      const chat = model.startChat({
        history: chatHistory,
        generationConfig: { maxOutputTokens: 2048 },
      });
      
      const result = await chat.sendMessageStream(finalPrompt);
      let fullText = "";
      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          fullText += text;
          onChunk(fullText);
        }
      }
      return { text: fullText };
    } else {
      const chat = model.startChat({
        history: chatHistory,
      });
      const result = await chat.sendMessage(finalPrompt);
      return { text: result.response.text() || "" };
    }
  }
}
