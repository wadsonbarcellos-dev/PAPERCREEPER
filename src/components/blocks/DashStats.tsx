import React from "react";
import { Server, Activity, Users, Globe, Database, Cpu } from "lucide-react";
import { motion } from "motion/react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon, color, trend }) => (
  <div className={`bg-black/20 border border-emerald-900/30 rounded-2xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-${color}-500/50 transition-all`}>
    <div className={`absolute -right-2 -top-2 opacity-5 group-hover:opacity-10 transition-opacity text-${color}-500`}>
      {icon}
    </div>
    <div className="flex items-center gap-2">
      <div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-end justify-between mt-2">
      <span className="text-2xl font-black text-white italic tracking-tighter leading-none">{value}</span>
      {trend && <span className="text-[10px] font-bold text-emerald-500">{trend}</span>}
    </div>
  </div>
);

interface DashStatsProps {
  stats: {
    totalServers: number;
    onlineServers: number;
    totalPlayers: number;
    cpuLoad: string;
    ramUsage: string;
    diskUsage: string;
  };
}

export const DashStats: React.FC<DashStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <StatsCard label="Servidores" value={stats.totalServers} icon={<Database size={16} />} color="emerald" />
      <StatsCard label="Online" value={stats.onlineServers} icon={<Globe size={16} />} color="blue" trend="ATIVOS" />
      <StatsCard label="Jogadores" value={stats.totalPlayers} icon={<Users size={16} />} color="purple" trend="+12%" />
      <StatsCard label="Carga CPU" value={stats.cpuLoad} icon={<Cpu size={16} />} color="amber" />
      <StatsCard label="Memória RAM" value={stats.ramUsage} icon={<Activity size={16} />} color="emerald" />
      <StatsCard label="Armazenamento" value={stats.diskUsage} icon={<Server size={16} />} color="zinc" />
    </div>
  );
};
