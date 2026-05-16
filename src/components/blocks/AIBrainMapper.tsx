import React from "react";
import { Settings } from "lucide-react";

interface CustomAI {
  id: string;
  name: string;
  endpoint: string;
  model: string;
  apiKey: string;
}

interface AIBrainMapperProps {
  aiMappings: Record<string, string>;
  setAiMappings: (mappings: any) => void;
  customAIs: CustomAI[];
  onConfigClick: () => void;
}

export const AIBrainMapper: React.FC<AIBrainMapperProps> = ({
  aiMappings,
  setAiMappings,
  customAIs,
  onConfigClick
}) => {
  const updateMapping = (key: string, val: string) => {
    setAiMappings((prev: any) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="flex flex-col gap-2 mb-3 shrink-0">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-black/20 p-3 rounded-xl border border-emerald-900/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
          {/* CHAT */}
          <div className="space-y-1">
            <label className="text-[8px] font-black text-emerald-500 uppercase tracking-widest pl-1">💬 CHAT PRINCIPAL</label>
            <select
              value={aiMappings.chat || "default"}
              onChange={(e) => updateMapping("chat", e.target.value)}
              className="w-full bg-emerald-950/40 border border-emerald-900 rounded-lg px-3 py-2 text-[10px] font-bold text-emerald-300 outline-none focus:border-emerald-500 uppercase tracking-wider backdrop-blur-md"
            >
              <option value="default">Auto (Sincronizado)</option>
              <option value="gemini">✨ Gemini</option>
              {customAIs.map(ai => <option key={ai.id} value={ai.id}>🤖 {ai.name}</option>)}
            </select>
          </div>
          
          {/* HEALER */}
          <div className="space-y-1">
            <label className="text-[8px] font-black text-blue-500 uppercase tracking-widest pl-1">🛡️ AUTO-HEALER</label>
            <select
              value={aiMappings.healer || "default"}
              onChange={(e) => updateMapping("healer", e.target.value)}
              className="w-full bg-blue-950/40 border border-blue-900 rounded-lg px-3 py-2 text-[10px] font-bold text-blue-300 outline-none focus:border-blue-500 uppercase tracking-wider backdrop-blur-md"
            >
              <option value="default">Auto (Sincronizado)</option>
              <option value="gemini">✨ Gemini</option>
              {customAIs.map(ai => <option key={ai.id} value={ai.id}>🤖 {ai.name}</option>)}
            </select>
          </div>

          {/* AUTOMATION */}
          <div className="space-y-1">
            <label className="text-[8px] font-black text-fuchsia-500 uppercase tracking-widest pl-1">⚙️ AUTOMAÇÃO/CODE</label>
            <select
              value={aiMappings.automation || "default"}
              onChange={(e) => updateMapping("automation", e.target.value)}
              className="w-full bg-fuchsia-950/40 border border-fuchsia-900 rounded-lg px-3 py-2 text-[10px] font-bold text-fuchsia-300 outline-none focus:border-fuchsia-500 uppercase tracking-wider backdrop-blur-md"
            >
              <option value="default">Auto (Sincronizado)</option>
              <option value="gemini">✨ Gemini</option>
              {customAIs.map(ai => <option key={ai.id} value={ai.id}>🤖 {ai.name}</option>)}
            </select>
          </div>

          {/* CONFIG BUTTON */}
          <div className="flex items-end pb-0.5">
            <button
              onClick={onConfigClick}
              className="w-full h-9 bg-emerald-900/40 hover:bg-emerald-800 text-emerald-400 rounded-lg text-[9px] font-black transition-all flex items-center justify-center border border-emerald-800 uppercase tracking-widest gap-2"
            >
              <Settings size={12} /> CONFIG APIs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
