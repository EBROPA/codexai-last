
import React from 'react';
import { useLanguage } from '../lib/i18n';

export const Team: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-32 bg-void relative border-t border-white/10">
      <div className="px-4 md:px-12 max-w-[90rem] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20">
           <h2 className="text-6xl md:text-8xl font-serif font-bold text-white uppercase tracking-tighter">
             {t.team.title} <br/><span className="text-zinc-600">{t.team.titleHighlight}</span>
           </h2>
           <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest max-w-md text-right mt-8 md:mt-0">
             {t.team.desc}
           </p>
        </div>

        <div className="border-t border-white/20">
           {t.team.members.map((member, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-between py-8 border-b border-white/10 hover:bg-white hover:px-8 transition-all duration-300 cursor-none"
              >
                 <span className="text-3xl md:text-5xl font-serif text-zinc-400 group-hover:text-black transition-colors">
                    {member.name}
                 </span>
                 <div className="flex items-center gap-4">
                    <span className="font-mono text-xs uppercase text-neon-acid group-hover:text-black transition-colors">
                       {member.role}
                    </span>
                    <div className="w-2 h-2 bg-neon-acid rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </section>
  );
};
