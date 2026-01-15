
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  return (
    <section className="py-32 px-4 md:px-12 bg-black border-t border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-16 text-center uppercase">
          {t.faq.title} <span className="text-zinc-600">{t.faq.titleHighlight}</span>
        </h2>
        
        <div className="space-y-4">
          {t.faq.items.map((item, idx) => (
            <div 
              key={idx} 
              className="border border-white/10 bg-zinc-950 overflow-hidden transition-colors hover:border-white/30"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left interactive group"
              >
                <span className="text-lg md:text-xl font-serif text-white pr-8 group-hover:text-neon-acid transition-colors">{item.q}</span>
                <div className={`shrink-0 p-2 rounded-full border border-white/20 transition-all duration-300 ${openIndex === idx ? 'bg-white text-black rotate-180' : 'text-white group-hover:bg-white/10'}`}>
                  {openIndex === idx ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>
              
              <div 
                className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-6 md:p-8 pt-0 text-zinc-400 font-sans text-sm md:text-base leading-relaxed border-t border-white/5">
                  {item.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
