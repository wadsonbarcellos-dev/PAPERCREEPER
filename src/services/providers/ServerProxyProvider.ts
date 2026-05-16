// src/services/providers/ServerProxyProvider.ts
import { AIProvider, AIResponse } from "../aiProvider";

export class ServerProxyProvider implements AIProvider {
  constructor(private endpoint: string, private options: any) {}

  async ask(prompt: string, context?: string, history?: any[], onChunk?: (text: string) => void): Promise<AIResponse> {
    const isStream = !!onChunk;
    const endpoint = isStream ? this.endpoint.replace(/\/ai$/, "/ai/stream") : this.endpoint;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context, history, ...this.options })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    if (isStream && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");
            
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const data = line.slice(6);
                    if (data === "[DONE]") continue;
                    try {
                        const json = JSON.parse(data);
                        const content = json.choices?.[0]?.delta?.content || json.text || "";
                        if (content) {
                            fullText += content;
                            onChunk(content);
                        }
                    } catch (e) {}
                }
            }
        }
        return { text: fullText };
    }
    
    const result = await response.json();
    return { text: result.text, call: result.call };
  }
}
