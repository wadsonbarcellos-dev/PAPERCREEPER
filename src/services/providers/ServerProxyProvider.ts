// src/services/providers/ServerProxyProvider.ts
import { AIProvider, AIResponse } from "../aiProvider";

export class ServerProxyProvider implements AIProvider {
  constructor(private endpoint: string, private options: any) {}

  async ask(prompt: string, context?: string, history?: any[], onChunk?: (text: string) => void): Promise<AIResponse> {
    // simplified for now, keeping the logic from geminiService.ts
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context, history, ...this.options })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    if (onChunk) {
        // ... (marquee-less, industrial streaming logic here later)
        return { text: "Streaming not implemented in proxy yet" };
    }
    
    const result = await response.json();
    return { text: result.text, call: result.call };
  }
}
