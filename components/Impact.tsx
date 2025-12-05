
import React from 'react';
import { useLanguage } from '../lib/i18n';

export const Impact: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-20 border-b border-white/10 bg-zinc-950">
      <div className="px-4 md:px-12 max-w-[90rem] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {t.impact.stats.map((stat, idx) => (
            <div key={idx} className="group cursor-default">
              <div className="text-4xl md:text-6xl font-serif font-bold text-white mb-2 group-hover:text-neon-acid transition-colors duration-300">
                {stat.value}
              </div>
              <div className="h-[1px] w-full bg-white/10 mb-4 group-hover:bg-neon-acid/50 transition-colors"></div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-zinc-300">{stat.label}</h3>
              <p className="text-xs text-zinc-600 font-mono mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
