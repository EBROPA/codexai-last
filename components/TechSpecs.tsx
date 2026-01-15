
import React from 'react';
import { Cpu, Shield, Zap, Globe, Database, Smartphone } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export const TechSpecs: React.FC = () => {
  const { t } = useLanguage();

  const ICONS = [Database, Zap, Shield];

  return (
    <section className="py-24 bg-zinc-950 border-b border-white/10 relative overflow-hidden">
      
      {/* Background Grid Blueprint */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      
      <div className="px-4 md:px-12 max-w-[90rem] mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/10 pb-8">
           <div>
               <div className="text-neon-acid font-mono text-xs uppercase tracking-widest mb-4">
                   {t.techSpecs.subtitle}
               </div>
               <h2 className="text-4xl md:text-5xl font-serif font-bold text-white uppercase">
                   {t.techSpecs.title}
               </h2>
           </div>
           <div className="text-right">
               <div className="text-4xl font-mono text-white font-bold">100<span className="text-zinc-600 text-lg">/100</span></div>
               <div className="text-zinc-500 text-xs uppercase tracking-widest">{t.techSpecs.score}</div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {t.techSpecs.blocks.map((block, idx) => {
                const Icon = ICONS[idx] || Cpu;
                return (
                    <div key={idx} className="border border-white/10 bg-black p-8">
                        <div className="flex items-center gap-3 mb-6 text-white">
                            <Icon size={20} className="text-neon-acid"/>
                            <h3 className="font-mono text-sm uppercase tracking-widest">{block.title}</h3>
                        </div>
                        <ul className="space-y-4 font-mono text-sm text-zinc-400">
                            {block.items.map((item, i) => (
                                <li key={i} className={`flex justify-between ${i !== block.items.length - 1 ? 'border-b border-white/5 pb-2' : 'pt-2'}`}>
                                    <span>{item.label}</span>
                                    <span className="text-white">{item.val}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            })}

        </div>

        <div className="mt-8 p-4 border border-white/10 bg-zinc-900/30 font-mono text-xs text-zinc-500 uppercase flex items-center gap-4">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span>{t.techSpecs.status}</span>
        </div>

      </div>
    </section>
  );
};
