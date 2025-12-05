
import React from 'react';
import { Store, Globe2, Building2 } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export const TargetAudience: React.FC = () => {
  const { t } = useLanguage();
  
  // Icons mapping to match the order in content.ts
  const ICONS = [
    <Store size={32} />,
    <Globe2 size={32} />,
    <Building2 size={32} />
  ];

  return (
    <section className="py-32 bg-zinc-950 border-b border-white/10 relative">
      <div className="px-4 md:px-12 max-w-[90rem] mx-auto">
        <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 uppercase">
                {t.targetAudience.title} <span className="text-neon-acid">{t.targetAudience.titleHighlight}</span>
            </h2>
            <p className="text-zinc-500 font-mono uppercase tracking-widest">
                {t.targetAudience.subtitle}
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {t.targetAudience.items.map((item, idx) => (
                <div key={idx} className="bg-void border border-white/10 p-8 md:p-12 hover:border-neon-acid/50 transition-colors group">
                    <div className="mb-8 text-zinc-500 group-hover:text-neon-acid transition-colors">
                        {ICONS[idx]}
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-white mb-4">{item.title}</h3>
                    <p className="text-zinc-400 mb-8 font-sans leading-relaxed">{item.desc}</p>
                    <ul className="space-y-3">
                        {item.points.map((point, i) => (
                            <li key={i} className="flex items-center gap-3 text-sm font-mono text-zinc-500 uppercase tracking-wide">
                                <div className="w-1.5 h-1.5 bg-neon-acid rounded-full"></div>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};
