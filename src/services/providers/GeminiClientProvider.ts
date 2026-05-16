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

    const systemText = 'Você é o "PaperCreeper AI", OPERADOR SUPREMO e ENGENHEIRO de servidores Minecraft. Use emojis.';
    const finalPrompt = context ? `CONTEXTO:\n${context}\n\nPERGUNTA: ${prompt}` : prompt;
    contents.push({ role: "user", parts: [{ text: finalPrompt }] });

    const config = {
      model: this.modelName,
      systemInstruction: { parts: [{ text: systemText }] },
      contents
    };

    if (onChunk) {
      const result = await ai.models.generateContentStream(config);
      let fullText = "";
      for await (const chunk of result) {
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.text) {
          const text = chunk.candidates[0].content.parts[0].text;
          fullText += text;
          onChunk(fullText);
        }
      }
      return { text: fullText };
    } else {
      const result = await ai.models.generateContent(config);
      return { text: result.candidates?.[0]?.content?.parts?.[0]?.text || "" };
    }
  }
}
