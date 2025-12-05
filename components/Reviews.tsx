
import React from 'react';
import { useLanguage } from '../lib/i18n';

export const Reviews: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-32 bg-black relative overflow-hidden">
       <div className="px-4 md:px-12 max-w-[90rem] mx-auto relative z-10">
          
          <div className="mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
              <h2 className="text-xs font-mono text-neon-acid uppercase tracking-widest">
                {t.reviews.subtitle}
              </h2>
              <div className="flex gap-8 opacity-40 hover:opacity-100 transition-all duration-500">
                  {/* Text Logos for B2B feel */}
                  <div className="text-xl font-serif font-bold text-white">GOOGLE</div>
                  <div className="text-xl font-serif font-bold text-white">YANDEX</div>
                  <div className="text-xl font-serif font-bold text-white">SBER</div>
                  <div className="text-xl font-serif font-bold text-white">VTB</div>
              </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
             {t.reviews.items.map((review, idx) => (
                <div key={idx} className="bg-zinc-950 border border-white/10 p-10 hover:border-white/30 transition-all duration-300 group hover:-translate-y-1 shadow-sm">
                   <div className="flex flex-col gap-1 mb-8">
                       <div className="font-serif font-bold text-2xl text-white">{review.client}</div>
                       <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wide">{review.role}</div>
                   </div>
                   
                   <p className="text-base text-zinc-400 mb-8 leading-relaxed font-sans">
                      "{review.text}"
                   </p>
                   
                   <div className="border-t border-white/10 pt-4 flex items-center gap-2">
                       <span className="text-neon-acid font-mono text-xs uppercase font-bold">{t.portfolio.result}:</span>
                       <span className="text-white font-bold text-sm">{review.result}</span>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
};
