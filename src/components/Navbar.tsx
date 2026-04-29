import { Link } from "react-router-dom";
import { Sparkles, ShoppingCart, User, Shield, Menu, Languages } from "lucide-react";

export default function Navbar({ appConfig, setAppConfig, t }: { appConfig: any, setAppConfig: any, t: any }) {
  const storeLink = appConfig.externalUrl || "/site/loja";
  const isExternal = !!appConfig.externalUrl;
  const showStore = appConfig.storeEnabled || isExternal;

  const toggleLanguage = () => {
    setAppConfig((prev: any) => ({
      ...prev,
      language: prev.language === 'en' ? 'pt' : 'en'
    }));
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/site" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 outline outline-4 outline-indigo-100 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-all duration-300 shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-800 ml-1">
              Aethel<span className="text-indigo-600">MC</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 font-medium text-slate-600">
            <Link to="/site" className="hover:text-indigo-600 transition-colors">{t.nav.home}</Link>
            
            {showStore && (
              isExternal ? (
                <a href={storeLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                  {t.nav.store} <ShoppingCart className="w-4 h-4" />
                </a>
              ) : (
                <Link to={storeLink} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
                  {t.nav.store} <ShoppingCart className="w-4 h-4" />
                </Link>
              )
            )}

            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors uppercase text-xs font-bold ring-1 ring-slate-200 px-2 py-1 rounded"
            >
              <Languages className="w-4 h-4" />
              {appConfig.language}
            </button>
          </div>

          {/* Profile / Auth */}
          <div className="flex items-center gap-4">
            <Link 
              to="/site/perfil" 
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">{t.nav.profile}</span>
            </Link>
            
            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-slate-400 hover:text-slate-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
