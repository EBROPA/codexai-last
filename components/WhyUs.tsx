
import React from 'react';
import { Target, Lightbulb, Workflow } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export const WhyUs: React.FC = () => {
  const { t } = useLanguage();

  // Icons mapping to match the order in content.ts
  const ICONS = [
    <Target size={32} />,
    <Lightbulb size={32} />,
    <Workflow size={32} />
  ];

  return (
    <section className="py-32 bg-void relative overflow-hidden border-t border-white/10">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>

      <div className="px-4 md:px-12 max-w-[90rem] mx-auto relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
           <h2 className="text-5xl md:text-7xl font-serif font-bold text-white uppercase tracking-tighter leading-none">
             {t.whyUs.title} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-acid to-white">{t.whyUs.titleHighlight}</span>
           </h2>
           <div className="max-w-md border-l border-neon-acid pl-6">
             <p className="text-zinc-400 font-mono text-sm leading-relaxed uppercase">
               {t.whyUs.subtitle}
             </p>
           </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {t.whyUs.items.map((item, idx) => (
            <div 
              key={idx} 
              className="group p-8 md:p-12 border border-white/10 bg-zinc-950/50 hover:bg-zinc-900 transition-all duration-300 hover:-translate-y-2 hover:border-neon-acid/50"
            >
              <div className="mb-6 text-zinc-500 group-hover:text-neon-acid transition-colors duration-300">
                {ICONS[idx]}
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-4 group-hover:translate-x-1 transition-transform">
                {item.title}
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-sans group-hover:text-zinc-300 transition-colors">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
