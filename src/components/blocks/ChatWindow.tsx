import React from "react";
import { motion } from "motion/react";
import { Bot, Brain, Mic, Send, RefreshCw } from "lucide-react";

interface AiMessage {
  role: "user" | "assistant";
  text: string;
}

interface ChatWindowProps {
  aiChat: AiMessage[];
  aiLoading: boolean;
  aiInput: string;
  setAiInput: (val: string) => void;
  onSend: (e?: React.FormEvent, override?: string) => void;
  onReset: () => void;
  aiDisabled: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  aiChat,
  aiLoading,
  aiInput,
  setAiInput,
  onSend,
  onReset,
  aiDisabled
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [aiChat]);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent">
        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar mb-4 space-y-4" ref={scrollRef}>
          {aiChat.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <Bot size={64} className="mb-4 text-emerald-500" />
              <p className="font-black italic uppercase tracking-tighter text-xl">Como posso ajudar?</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-2 max-w-xs">
                Pergunte sobre erros, comandos ou como otimizar seu servidor.
              </p>
            </div>
          )}
          {aiChat.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] p-4 rounded-2xl border-2 ${
                msg.role === "user" 
                ? "bg-emerald-900 shadow-sm border-emerald-700 text-white rounded-tr-none" 
                : "bg-black/40 border-emerald-900 text-emerald-100 rounded-tl-none font-mono text-sm shadow-inner"
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {aiLoading && (
            <div className="flex justify-start">
              <div className="bg-black/40 border border-emerald-900/50 text-emerald-500 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                 <motion.div
                   animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                   className="text-emerald-400"
                 >
                   <Brain size={20} />
                 </motion.div>
                 <div className="italic font-black text-xs uppercase tracking-widest animate-pulse">PENSANDO...</div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <form onSubmit={(e) => onSend(e)} className="relative flex items-center gap-3">
             <button
               type="button"
               onClick={() => {
                  const recognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
                  if (recognition) {
                      const rec = new recognition();
                      rec.lang = 'pt-BR';
                      rec.onresult = (evt: any) => setAiInput(evt.results[0][0].transcript);
                      rec.start();
                  }
               }}
               className="w-14 h-14 bg-emerald-950/40 border border-emerald-900/50 rounded-2xl flex items-center justify-center text-emerald-500 hover:bg-emerald-800 transition-all shadow-inner shrink-0"
             >
                <Mic size={24} />
             </button>
             <div className="relative flex-1">
               <input
                 className="w-full bg-black/60 border border-emerald-900/50 rounded-2xl px-6 py-4 text-emerald-50 font-medium outline-none focus:border-emerald-500 transition-all shadow-inner pr-16 disabled:opacity-50"
                 placeholder={aiDisabled ? "Assistente Desativado" : "Pergunte qualquer coisa..."}
                 value={aiInput}
                 onChange={(e) => setAiInput(e.target.value)}
                 disabled={aiDisabled || aiLoading}
               />
               <button
                 type="submit"
                 disabled={!aiInput.trim() || aiLoading || aiDisabled}
                 className="absolute right-3 top-3 w-10 h-10 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg border-b-4 border-emerald-800 flex items-center justify-center disabled:opacity-50"
               >
                 <Send size={24} />
               </button>
             </div>
          </form>
        </div>
    </div>
  );
};
