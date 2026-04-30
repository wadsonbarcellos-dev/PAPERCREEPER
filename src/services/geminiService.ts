/// <reference types="vite/client" />

export const askAI = async (prompt: string, context?: string, serverId?: string) => {
  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, context, serverId })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({ error: "Erro no servidor" }));
      throw new Error(errData.error || "Servidor de IA inacessível");
    }

    const result = await response.json();
    return { text: result.text, call: result.call };
  } catch (error: any) {
    console.error("AI Bridge Error:", error);
    return { 
      text: `Erro ao conectar com a IA: ${error.message}. 
             Dica: Certifique-se de que a Chave de API está configurada na aba de Configurações! 🔌` 
    };
  }
};
