import React from 'react';
import { Zap, Plus, Activity, Power } from 'lucide-react';

interface QuickActionsProps {
  handleOptimizeSystem: () => void;
  setShowCreateModal: (show: boolean) => void;
  setNewServerConfig: (config: any) => void;
  setActiveTab: (tab: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  handleOptimizeSystem,
  setShowCreateModal,
  setNewServerConfig,
  setActiveTab,
}) => {
  const actions = [
    { label: "Otimizar", icon: <Zap size={20} />, color: "text-emerald-500", action: handleOptimizeSystem },
    { label: "Novo Server", icon: <Plus size={20} />, color: "text-sky-500", action: () => { setShowCreateModal(true); setNewServerConfig({ name: "", ram: 4, type: "spigot", version: "1.21.1", usePlayit: true, minRam: 1, url: "" }); } },
    { label: "Diagnóstico", icon: <Activity size={20} />, color: "text-amber-500", action: () => setActiveTab("system") },
    { label: "Sair", icon: <Power size={20} />, color: "text-rose-500", action: () => window.location.reload() },
  ];

  return (
    <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8">
      <h3 className="text-xl font-black text-white tracking-widest uppercase italic mb-6">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((btn, bidx) => (
          <button
            key={bidx}
            onClick={btn.action}
            className="p-6 bg-zinc-800/40 hover:bg-zinc-700/60 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className={`${btn.color} group-hover:scale-125 transition-transform`}>
              {btn.icon}
            </div>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{btn.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
