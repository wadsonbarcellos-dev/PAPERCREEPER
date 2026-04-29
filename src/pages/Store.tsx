import { useState } from "react";
import { Sparkles, Coins, CreditCard, Search, Tag, Filter } from "lucide-react";
import { motion } from "motion/react";

const categories = ["Todos", "Ranks VIP", "Cosméticos", "Pets", "Títulos", "Auras"];

const storeItems = [
  { id: 1, name: "VIP Aventureiro", desc: "Tag no chat, /fly no lobby e 5 caixas misteriosas.", category: "Ranks VIP", priceReal: 15.00, priceCoins: 5000, img: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=2574&auto=format&fit=crop" },
  { id: 2, name: "Fantasia de Dragão", desc: "Morfe em um filhote de dragão no spawn e cuspa fogos de artifício.", category: "Cosméticos", priceReal: 25.00, priceCoins: 12000, img: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2670&auto=format&fit=crop" },
  { id: 3, name: "Pet Raposa", desc: "Uma raposinha bebê que te segue pelos lobbies e cidades.", category: "Pets", priceReal: 10.00, priceCoins: 3500, img: "https://images.unsplash.com/photo-1541364983171-a8ba01e95fa2?q=80&w=2669&auto=format&fit=crop" },
  { id: 4, name: "Título [Lenda]", desc: "Destaque seu nome globalmente com a tag Lenda em dourado.", category: "Títulos", priceReal: 5.00, priceCoins: 1500, img: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=2574&auto=format&fit=crop" },
  { id: 5, name: "Aura de Fogo", desc: "Partículas de chamas giram ao seu redor (desativadas em PvP).", category: "Auras", priceReal: 8.00, priceCoins: 2800, img: "https://images.unsplash.com/photo-1502485038338-08a042971ecc?q=80&w=2669&auto=format&fit=crop" },
  { id: 6, name: "VIP Lenda", desc: "Benefícios absurdos cosméticos, cor no chat e 15 caixas misteriosas.", category: "Ranks VIP", priceReal: 45.00, priceCoins: 25000, img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop" },
];

export default function Store({ config, t }: { config: any, t: any }) {
  const categories = [t.store.all, t.store.vip_ranks, t.store.cosmetics, t.store.pets, t.store.titles, t.store.auras];

  const [activeCat, setActiveCat] = useState(t.store.all);
  const [search, setSearch] = useState("");
  const [activeServer, setActiveServer] = useState("Global");

  if (config.familyMode) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Tag className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.store.disabled_title}</h2>
        <p className="text-slate-500 max-w-md mx-auto">{t.store.disabled_desc}</p>
      </div>
    );
  }

  if (!config.storeEnabled) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Tag className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">{t.store.closed_title}</h2>
        <p className="text-slate-500 max-w-md mx-auto">{t.store.closed_desc}</p>
      </div>
    );
  }

  const filteredItems = storeItems.filter(item => {
    const itemCat = t.store[item.category === "Ranks VIP" ? "vip_ranks" : item.category === "Cosméticos" ? "cosmetics" : item.category === "Pets" ? "pets" : item.category === "Títulos" ? "titles" : "auras"];
    const matchCat = activeCat === t.store.all || itemCat === activeCat;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2 flex items-center gap-3">
            {t.store.title} <Sparkles className="w-8 h-8 text-indigo-500" />
          </h1>
          <p className="text-slate-500 text-lg">{t.store.subtitle}</p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-auto">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={t.store.search} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-72 pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-slate-700"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Server Selector for Multi-server Mode */}
        {config.serverMode === 'multi' ? (
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            {["Global", "Survival", "Skyblock", "Lobby"].map(svr => (
              <button
                key={svr}
                onClick={() => setActiveServer(svr)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeServer === svr ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {svr}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
            {t.store.single_mode}
          </div>
        )}

        {/* Categories */}
        <div className="flex overflow-x-auto pb-2 md:pb-0 custom-scrollbar gap-2 max-w-full">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                activeCat === cat 
                  ? "bg-slate-800 text-white shadow-md shadow-slate-800/20" 
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={item.id} 
            className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
          >
            {/* Image */}
            <div className="h-48 overflow-hidden relative">
              <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold uppercase tracking-wider rounded-lg text-slate-800">
                {item.category}
              </div>
              <img 
                src={item.img} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={item.name} 
              />
            </div>
            
            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{item.name}</h3>
              <p className="text-slate-500 text-sm mb-6 flex-1">{item.desc}</p>
              
              {/* Pricing & Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-auto">
                <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-colors">
                  <div className="flex items-center gap-1 font-bold text-lg leading-none mb-1">
                    <Coins className="w-4 h-4" />
                    {item.priceCoins.toLocaleString()}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">{t.store.currency_coins}</span>
                </button>
                <button className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors">
                  <div className="flex items-center gap-1 font-bold text-lg leading-none mb-1">
                    <CreditCard className="w-4 h-4" />
                    R$ {item.priceReal.toFixed(2)}
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-bold opacity-70">{t.store.currency_money}</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
