import React from "react";
import { Server, Plus, Settings2, Power, MoreVertical, LayoutGrid, List } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ServerData {
  id: string;
  name: string;
  status: string;
  port: number;
  type: string;
}

interface ServerListProps {
  servers: ServerData[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onStatusToggle: (id: string) => void;
}

export const ServerList: React.FC<ServerListProps> = ({ 
  servers, 
  activeId, 
  onSelect, 
  onAdd,
  onStatusToggle 
}) => {
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-950/20 rounded-lg text-emerald-500">
            <Server size={18} />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-tighter italic">Infraestrutura</h2>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex bg-black/40 p-1 rounded-lg border border-emerald-900/30">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "grid" ? "bg-emerald-600 text-white shadow-lg" : "text-emerald-900 hover:text-emerald-400"}`}
              >
                <LayoutGrid size={14} />
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md transition-all ${viewMode === "list" ? "bg-emerald-600 text-white shadow-lg" : "text-emerald-900 hover:text-emerald-400"}`}
              >
                <List size={14} />
              </button>
           </div>
           <button 
             onClick={onAdd}
             className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase rounded-lg shadow-lg border-b-2 border-emerald-800 transition-all active:scale-95"
           >
             <Plus size={14} /> Novo Setor
           </button>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
        <AnimatePresence mode="popLayout">
          {servers.map((srv) => (
            <motion.div
              key={srv.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={() => onSelect(srv.id)}
              className={`group flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                activeId === srv.id 
                ? "bg-emerald-900/40 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]" 
                : "bg-zinc-950/40 border-zinc-900 hover:border-emerald-900/50"
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`p-3 rounded-xl ${srv.status === "online" ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-zinc-800 text-zinc-500"}`}>
                   <Server size={20} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-tight truncate max-w-[120px]">{srv.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${srv.status === "online" ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{srv.status}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); onStatusToggle(srv.id); }}
                  className={`p-2 rounded-lg transition-all ${srv.status === "online" ? "bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white" : "bg-emerald-950 text-emerald-500 hover:bg-emerald-600 hover:text-white"}`}
                >
                  <Power size={14} />
                </button>
              </div>
              
              {/* Progress bar background decor */}
              <div className="absolute bottom-0 left-0 h-1 bg-emerald-500/10 w-full">
                 <div className="h-full bg-emerald-500/30 transition-all" style={{ width: srv.status === 'online' ? '100%' : '0%' }} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
