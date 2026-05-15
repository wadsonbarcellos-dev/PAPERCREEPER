// src/services/aiProvider.ts

export interface AIResponse {
  text: string;
  call?: any;
  error?: string;
}

export interface AIProvider {
  ask(
    prompt: string,
    context?: string,
    history?: any[],
    onChunk?: (text: string) => void
  ): Promise<AIResponse>;
}
