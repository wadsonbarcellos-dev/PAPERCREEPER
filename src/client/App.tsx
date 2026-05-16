import { useEffect, useState, useRef } from 'react';
import { Activity, ShieldCheck, Zap, Terminal } from 'lucide-react';
import { io } from 'socket.io-client';

export const App = () => {
  const [health, setHealth] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error('Health check failed', err));

    const socket = io();
    socket.on('log', (logEntry) => {
        setLogs(prev => [...prev.slice(-49), logEntry]);
    });

    return () => {
        socket.disconnect();
    };
  }, []);

  useEffect(() => {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen font-sans p-8">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />
        
        <header className="flex flex-col items-center space-y-4 relative z-10 mb-8">
          <div className="p-4 bg-slate-800 rounded-2xl ring-1 ring-slate-700 shadow-xl">
            <Zap className="w-12 h-12 text-blue-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mt-4">
            OMNI-ARCHITECT CORE
          </h1>
          <p className="text-slate-400 text-center max-w-md">
            Ecossistema de nível industrial inicializado. Infraestrutura provida, observabilidade ativa e segurança aplicada (L7/Rate Limits).
          </p>
        </header>

        <main className="space-y-6 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50 flex flex-col justify-center space-y-2">
                <div className="flex items-center space-x-4">
                <ShieldCheck className="w-8 h-8 text-emerald-500 shrink-0" />
                <div>
                    <h3 className="text-white font-semibold flex items-center gap-2">Blindagem Ativa <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs uppercase tracking-widest font-black">Online</span></h3>
                    <p className="text-slate-400 text-sm mt-1">Defesa contra ataques DDoS, Rate Limiting agressivo e Circuit Breakers armados no proxy reverso.</p>
                </div>
                </div>
            </div>
            
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50 flex flex-col justify-center space-y-2">
                <div className="flex items-center space-x-4">
                <Activity className="w-8 h-8 text-blue-500 shrink-0" />
                <div className="flex-1">
                    <h3 className="text-white font-semibold">Telemetria do Sistema</h3>
                    <p className="text-slate-400 text-sm mt-1">Latência inter-processos monitorada e memory leaks mitigados agressivamente.</p>
                </div>
                </div>
                {health ? (
                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                    <div className="text-sm text-slate-400">ENGINE STATUS</div>
                    <div className="text-right shrink-0">
                        <div className="text-xl font-mono text-emerald-400 font-bold">{health.status}</div>
                        <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">UPTIME: {Math.floor(health.uptime)}s</div>
                    </div>
                </div>
                ) : (
                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-sm font-mono text-amber-400 animate-pulse">CONNECTING...</div>
                </div>
                )}
            </div>
          </div>

          <div className="bg-slate-950 rounded-2xl p-6 border border-slate-800/50 flex flex-col">
              <div className="flex items-center gap-2 mb-4 text-slate-300">
                  <Terminal className="w-5 h-5 text-fuchsia-400"/>
                  <h3 className="font-semibold text-sm tracking-wider uppercase">Live Core Stream</h3>
              </div>
              <div className="flex-1 rounded-xl bg-[#0d1117] border border-slate-800 p-4 font-mono text-xs overflow-y-auto min-h-[300px] shadow-inner space-y-1">
                  {logs.length === 0 && <span className="text-slate-600">Aguardando telemetria...</span>}
                  {logs.map((log, i) => (
                      <div key={i} className="flex gap-2">
                          <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span>
                          <span className={log.level === 'error' ? 'text-red-400' : log.level === 'warn' ? 'text-amber-400' : 'text-emerald-400'}>
                              {log.level.toUpperCase()}
                          </span>
                          <span className="text-slate-300 break-all">{log.message}</span>
                      </div>
                  ))}
                  <div ref={logsEndRef} />
              </div>
          </div>
        </main>
      </div>
    </div>
  );
};
