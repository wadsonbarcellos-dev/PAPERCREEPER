// src/services/providers/GeminiClientProvider.ts
import { GoogleGenAI } from "@google/genai";
import { AIProvider, AIResponse } from "../aiProvider";

export class GeminiClientProvider implements AIProvider {
  constructor(private apiKey: string, private modelName: string) {}

  async ask(prompt: string, context?: string, history?: any[], onChunk?: (text: string) => void): Promise<AIResponse> {
    const ai = new GoogleGenAI({ apiKey: this.apiKey });
    const contents = history ? history.map(h => ({
      role: h.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: h.text }]
    })) : [];
    
    const finalMsg = context ? `CONTEXTO:\n${context}\n\nPERGUNTA: ${prompt}` : prompt;
    contents.push({ role: "user", parts: [{ text: finalMsg }] });

    const config = { 
      systemInstruction: 'Você é o "PaperCreeper AI", OPERADOR SUPREMO e ENGENHEIRO de servidores Minecraft. Use emojis.',
      temperature: 0.7 
    };

    if (onChunk) {
      const stream = await ai.models.generateContentStream({
        model: this.modelName,
        contents,
        config
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
        model: this.modelName,
        contents,
        config
      });
      return { text: response.text || "" };
    }
  }
}
