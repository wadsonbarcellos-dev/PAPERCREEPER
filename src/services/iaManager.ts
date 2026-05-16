import axios from "axios";
import { GoogleGenAI } from "@google/genai";

/**
 * PAPERCREEPER IA MANAGER - Sistema Anti-Falhas e Autoconfigurável
 * Especialista de Poder Total em Arquitetura de Servidores
 */

export interface AIResponse {
  text: string;
  provider: string;
  model: string;
  isFallback?: boolean;
}

class IAManager {
  private geminiClient: GoogleGenAI | null = null;

  constructor() {
    this.refreshConfig();
  }

  private refreshConfig() {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      this.geminiClient = new GoogleGenAI({ apiKey: geminiKey });
    }
  }

  /**
   * Função principal universal. 
   * Se provider for especificado, tenta apenas ele. 
   * Se falhar, retorna erro para que VOCÊ decida o que fazer.
   */
  async generateResponse(
    prompt: string,
    systemInstruction: string = "Você é um assistente técnico especialista em servidores Minecraft.",
    history: any[] = [],
    options: { 
      provider?: string; 
      endpoint?: string; 
      model?: string; 
      geminiKey?: string; 
      nvidiaKey?: string; 
    } = {}
  ): Promise<AIResponse> {
    const { provider, endpoint, model, geminiKey, nvidiaKey } = options;

    // 1. Prioridade para Endpoints Customizados/OpenAI
    if (provider === "custom" || (endpoint && endpoint.startsWith("http"))) {
      return await this.tryGenericOpenAI(prompt, systemInstruction, endpoint!, model || "default", geminiKey || nvidiaKey || "", history);
    }

    // 2. Ollama (Local) - Selecionado Manualmente
    if (provider === "ollama" || provider === "local") {
      return await this.tryOllama(prompt, systemInstruction, history);
    }

    // 3. Gemini - Selecionado Manualmente
    if (provider === "gemini") {
      const key = geminiKey || process.env.GEMINI_API_KEY;
      if (!key) throw new Error("Chave Gemini não configurada.");
      return await this.tryGemini(prompt, systemInstruction, key, history);
    }

    // 4. NVIDIA - Selecionado Manualmente
    if (provider === "nvidia") {
      const key = nvidiaKey || process.env.NVIDIA_API_KEY;
      if (!key) throw new Error("Chave NVIDIA não configurada.");
      return await this.tryNvidia(prompt, systemInstruction, key, history);
    }

    // fallback apenas se for "auto" ou não especificado (Mantendo a compatibilidade com o Auto-Healer)
    return this.fallbackCircuit(prompt, systemInstruction, history, options);
  }

  /**
   * Tenta encontrar a melhor IA disponível baseada no .env caso o usuário não tenha escolhido uma específica
   */
  public async getAutoBrain(prompt: string, system: string, history: any[] = []): Promise<AIResponse> {
     // Ordem de preferência automática se o usuário não escolheu
     const geminiKey = process.env.GEMINI_API_KEY;
     const ollamaHost = process.env.OLLAMA_HOST;

     try {
        if (ollamaHost) return await this.tryOllama(prompt, system, history);
     } catch (e) {}

     try {
        if (geminiKey) return await this.tryGemini(prompt, system, geminiKey, history);
     } catch (e) {}

     return { text: "Sem conexão com IAs.", provider: "none", model: "none" };
  }

  private async fallbackCircuit(prompt: string, system: string, history: any[], opts: any): Promise<AIResponse> {
    const geminiKey = opts.geminiKey || process.env.GEMINI_API_KEY;
    
    // Tenta o que estiver configurado no .env como primário
    if (process.env.PRIMARY_IA === "ollama") {
       try { return await this.tryOllama(prompt, system, history); } catch (e) {}
    }
    
    try { 
      if (geminiKey) return await this.tryGemini(prompt, system, geminiKey, history); 
    } catch (e) {}
    
    try { return await this.tryOllama(prompt, system, history); } catch (e) {}
    
    return { text: "Erro: IA indisponível. Selecione uma manualmente.", provider: "none", model: "none" };
  }

  /**
   * Tenta um endpoint genérico compatível com OpenAI (Priority 0)
   */
  private async tryGenericOpenAI(prompt: string, system: string, endpoint: string, model: string, apiKey: string, history: any[] = []): Promise<AIResponse> {
    const messages = [
      { role: "system", content: system },
      ...history.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
      { role: "user", content: prompt }
    ];

    const response = await axios.post(
      endpoint,
      {
        model,
        messages,
        max_tokens: 2048,
        temperature: 0.7
      },
      {
        headers: {
          "Authorization": apiKey ? `Bearer ${apiKey}` : "",
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    return {
      text: response.data.choices[0].message.content,
      provider: "Custom Endpoint",
      model: model
    };
  }

  /**
   * Executa chamada ao Ollama (Local/Grátis)
   */
  private async tryOllama(prompt: string, system: string, history: any[] = []): Promise<AIResponse> {
    const host = process.env.OLLAMA_HOST || "http://localhost:11434";
    const model = process.env.OLLAMA_MODEL || "qwen2.5-coder:7b";

    let fullPrompt = `System: ${system}\n\n`;
    for (const msg of history) {
      fullPrompt += `${msg.role === "assistant" ? "Assistant" : "User"}: ${msg.text}\n`;
    }
    fullPrompt += `User: ${prompt}\nAssistant:`;

    const response = await axios.post(`${host}/api/generate`, {
      model,
      prompt: fullPrompt,
      stream: false,
      options: { num_predict: 1024, temperature: 0.7 }
    }, { timeout: 8000 });

    return {
      text: response.data.response,
      provider: "Ollama (Local)",
      model: model
    };
  }

  /**
   * Executa chamada ao Google Gemini
   */
  private async tryGemini(prompt: string, system: string, apiKey: string, history: any[] = []): Promise<AIResponse> {
    const client = new GoogleGenAI({ apiKey }) as any;
    const modelName = "gemini-1.5-flash";
    const model = client.getGenerativeModel({ 
      model: modelName,
      systemInstruction: system 
    });

    const chat = model.startChat({
      history: history.map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }]
      }))
    });

    const result = await chat.sendMessage(prompt);
    const text = result.response.text();

    return {
      text,
      provider: "Google Gemini",
      model: modelName,
      isFallback: true
    };
  }

  /**
   * Executa chamada à NVIDIA NIM
   */
  private async tryNvidia(prompt: string, system: string, apiKey: string, history: any[] = []): Promise<AIResponse> {
    const model = process.env.NVIDIA_MODEL || "meta/llama-3.1-70b-instruct";

    const messages = [
      { role: "system", content: system },
      ...history.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.text })),
      { role: "user", content: prompt }
    ];

    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model,
        messages,
        max_tokens: 1024,
        temperature: 0.5
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    return {
      text: response.data.choices[0].message.content,
      provider: "NVIDIA NIM",
      model: model,
      isFallback: true
    };
  }
}

export const iaManager = new IAManager();
export default iaManager;
