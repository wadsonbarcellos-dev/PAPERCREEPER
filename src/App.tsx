import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import Panel from "./pages/Panel";
import { translations } from "./lib/i18n";

function SiteLayout({ appConfig, setAppConfig, t }: { appConfig: any, setAppConfig: any, t: any }) {
  useEffect(() => {
    if (appConfig.performanceMode) {
      document.body.classList.add('performance-mode');
    } else {
      document.body.classList.remove('performance-mode');
    }
  }, [appConfig.performanceMode]);

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-800 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar appConfig={appConfig} setAppConfig={setAppConfig} t={t} />
      <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  // Global settings mock
  const [appConfig, setAppConfig] = useState(() => {
    try {
      const saved = localStorage.getItem("appConfig");
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return {
      storeEnabled: true,
      externalUrl: "", // e.g., "https://store.myserver.com"
      serverMode: "single", // "single" | "multi"
      language: navigator.language.startsWith('pt') ? 'pt' : 'en',
      performanceMode: false,
      familyMode: true,
    };
  });

  useEffect(() => {
    localStorage.setItem("appConfig", JSON.stringify(appConfig));
  }, [appConfig]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "appConfig" && e.newValue) {
        setAppConfig(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const t = translations[appConfig.language] || translations['en'];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Panel appConfig={appConfig} setAppConfig={setAppConfig} />} />
        
        <Route path="/site" element={appConfig.storeEnabled === false ? (
          <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mb-8 border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.1)]">
              <Shield className="w-10 h-10 text-rose-500" />
            </div>
            <h1 className="text-4xl font-black text-rose-500 mb-4 uppercase tracking-tighter italic">Portal Offline</h1>
            <p className="text-zinc-500 max-w-md font-bold uppercase text-[10px] tracking-widest leading-relaxed mb-8">
              A loja e o site deste servidor encontram-se desativados no momento pelo administrador.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all border border-zinc-800 active:scale-95"
            >
              Tentando Reconectar...
            </button>
          </div>
        ) : <SiteLayout appConfig={appConfig} setAppConfig={setAppConfig} t={t} />}>
          <Route index element={<Home appConfig={appConfig} t={t} />} />
          <Route path="loja" element={<Store config={appConfig} t={t} />} />
          <Route path="perfil" element={<Profile appConfig={appConfig} t={t} />} />
        </Route>
      </Routes>
    </Router>
  );
}
