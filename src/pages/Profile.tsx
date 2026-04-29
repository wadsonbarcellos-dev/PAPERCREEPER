import { useState } from "react";
import { User, Coins, Package, Heart, CreditCard, Clock, ShieldCheck, Gamepad2, Loader2, Info } from "lucide-react";

export default function Profile({ appConfig, t }: { appConfig: any, t: any }) {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [form, setForm] = useState({ username: "", password: "" });

  const handleLogin = async (e: any) => {
    e.preventDefault();
    if (!form.username || !form.password) return;
    
    setLoading(true);
    setErrorMsg("");
    
    try {
      // Endpoint integrado aos plugins AuthMe / nLogin do servidor via API Express
      const res = await fetch("/api/public/store/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: form.username, 
          password: form.password, 
          serverId: "default" // Assumindo servidor principal
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        setLogged(true);
      } else {
        setErrorMsg("Usuário ou senha incorretos.");
      }
    } catch(e) {
      setErrorMsg("Erro ao conectar no banco de dados do servidor Minecraft.");
    }
    setLoading(false);
  };

  if (!logged) {
    return (
      <div className="max-w-md mx-auto pt-20">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <Gamepad2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Conta In-Game</h2>
          <p className="text-slate-500 mb-6 text-sm">Use a mesma senha do seu /login no Minecraft. Nosso portal está sincronizado diretamente com os plugins do servidor.</p>
          
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl mb-4 text-sm font-bold border border-red-100 uppercase tracking-widest">
              {errorMsg}
            </div>
          )}
          
          <div className="space-y-3 mb-6">
            <input 
              type="text" 
              placeholder="Seu Nickname Exato"
              value={form.username}
              onChange={e => setForm({...form, username: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700 text-center"
            />
            <input 
              type="password" 
              placeholder="Sua senha do servidor"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700 text-center"
            />
            <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-slate-400 justify-center">
              <Info size={12}/> Suportamos conexões MySQL (AuthMe) e nLogin
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/20"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>Sincronizar Dados</span>}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Sidebar Info */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
             <User size={150} />
          </div>
          <img 
            src={`https://minotar.net/helm/${user?.username || 'Steve'}/150.png`}
            alt="Avatar" 
            className="w-32 h-32 rounded-3xl mx-auto mb-6 shadow-md relative z-10"
          />
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-1 relative z-10">{user?.username}</h2>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-bold mb-6 mt-2">
            <ShieldCheck className="w-4 h-4" />
            {user?.rank || "Registrado"}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Coins</span>
              <div className="flex items-center gap-1.5 text-xl font-black text-emerald-600">
                <Coins className="w-5 h-5" />
                {user?.coins?.toLocaleString() || "0"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Status</span>
              <div className="flex items-center gap-1.5 text-lg font-black text-emerald-500 text-xs text-center">
                Sincronizado
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={() => { setLogged(false); setUser(null); }}
          className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors uppercase text-sm tracking-widest"
        >
          Sair da Conta
        </button>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <Package className="w-6 h-6 text-indigo-500" /> 
            {t.profile.inventory_normal}
          </h3>
          
          <div className="space-y-4">
            {[
              { id: 1, name: "VIP Aventureiro", date: "Há 2 dias", type: "Rank VIP", icon: ShieldCheck, color: "text-yellow-500", bg: "bg-yellow-50" },
              { id: 2, name: "Pet Raposa", date: "Há 1 semana", type: "Cosmético", icon: Heart, color: "text-pink-500", bg: "bg-pink-50" },
              { id: 3, name: "5000 AethelCoins", date: "Há 1 mês", type: "Moeda In-game", icon: Coins, color: "text-orange-500", bg: "bg-orange-50" },
            ].map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all group">
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                    <span>{item.type}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-50 text-slate-600 font-bold rounded-lg border border-slate-200 hover:bg-slate-100">
                  {t.profile.view_receipt}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-[2rem] text-white shadow-xl flex items-center justify-between">
          <div>
            <h4 className="text-xl font-bold mb-2">{t.profile.need_coins}</h4>
            <p className="text-indigo-200 max-w-sm">{t.profile.need_coins_desc}</p>
          </div>
          <button className="px-6 py-3 bg-white text-indigo-900 font-black rounded-xl hover:scale-105 transition-transform flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t.profile.buy_coins_btn}
          </button>
        </div>
      </div>
    </div>
  );
}
