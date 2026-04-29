import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
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
      storeEnabled: false,
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

  const t = translations[appConfig.language] || translations['en'];

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Panel appConfig={appConfig} setAppConfig={setAppConfig} />} />
        
        <Route path="/site" element={appConfig.storeEnabled === false ? (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-black text-rose-500 mb-4 uppercase tracking-tighter italic">Portal Offline</h1>
            <p className="text-zinc-500 text-center max-w-md font-bold uppercase text-xs tracking-widest leading-relaxed">A loja e o site deste servidor encontram-se desativados no momento pelo administrador.</p>
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
