import { useState } from "react";
import { Copy, Check, Users, Sword, Shield, Globe } from "lucide-react";
import { motion } from "motion/react";

export default function Home({ appConfig, t }: { appConfig: any, t: any }) {
  const [copied, setCopied] = useState(false);
  const serverIP = "jogar.aethelmc.net";

  const handleCopy = () => {
    navigator.clipboard.writeText(serverIP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-indigo-900 text-white shadow-2xl shadow-indigo-900/20">
        {/* Abstract Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-purple-500/30 blur-3xl" />
        </div>
        
        <div className="relative px-8 py-24 sm:px-16 sm:py-32 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold tracking-wide">{t.hero?.players || "1,245 online"}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-indigo-200 mb-6"
          >
            {t.hero?.title || "Welcome"}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-indigo-100 max-w-2xl mb-12"
          >
            {t.hero?.subtitle || "The best server"}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button 
              onClick={handleCopy}
              className="group relative flex items-center gap-4 px-8 py-4 bg-white text-indigo-900 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
            >
              <div className="flex flex-col items-start leading-tight">
                <span className="text-xs text-indigo-500 font-bold uppercase tracking-wider">IP</span>
                <span>{serverIP}</span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </div>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid sm:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-indigo-500" />}
              title={t.features?.survival?.title || "Survival"}
              description={t.features?.survival?.desc || "Survival description"}
              color="bg-indigo-50"
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-orange-500" />}
              title={t.features?.community?.title || "Community"}
              description={t.features?.community?.desc || "Community description"}
              color="bg-orange-50"
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-emerald-500" />}
              title={t.features?.economy?.title || "Economy"}
              description={t.features?.economy?.desc || "Economy description"}
              color="bg-emerald-50"
            />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: any) {
  return (
    <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`w-14 h-14 rounded-2xl \${color} flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
