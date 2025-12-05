
import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../lib/i18n';

export const Philosophy: React.FC = () => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = document.querySelectorAll('.reveal-text');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-40 px-4 md:px-12 max-w-[90rem] mx-auto relative overflow-hidden">
      {/* Large background decorative text */}
      <div className="absolute right-0 top-20 text-[20vw] font-serif text-white/5 font-bold leading-none pointer-events-none select-none z-0 mix-blend-difference">
        FOCUS
      </div>

      <div className="grid md:grid-cols-12 gap-12 items-center relative z-10">
        <div className="md:col-span-8">
            <h2 className="reveal-text font-mono text-neon-acid text-sm uppercase tracking-widest mb-8">
              {t.philosophy.subtitle}
            </h2>
            <div ref={textRef} className="space-y-8">
              <p className="text-3xl md:text-5xl font-sans font-light leading-[1.2] text-white reveal-text transition-delay-100">
                {t.philosophy.text1} <br/>
                {t.philosophy.text2}
              </p>
              <p className="text-2xl md:text-4xl font-serif italic text-zinc-400 reveal-text transition-delay-200">
                {t.philosophy.text2Highlight}
              </p>
              <div className="w-24 h-[1px] bg-neon-acid reveal-text transition-delay-300"></div>
              <p className="text-zinc-500 text-lg md:text-xl max-w-2xl font-sans reveal-text transition-delay-400 leading-relaxed">
                {t.philosophy.desc}
              </p>
            </div>
        </div>
        
        <div className="md:col-span-4 flex flex-col justify-end items-end gap-12 border-l border-white/10 pl-8 md:pl-0 md:border-l-0">
           {t.philosophy.stats.map((stat, idx) => (
             <div key={idx} className={`reveal-text transition-delay-${500 + (idx * 100)} text-right w-full`}>
                <span className="block text-5xl md:text-7xl font-serif text-white mb-2">{stat.val}</span>
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest border-t border-zinc-800 pt-2 inline-block w-full text-right">{stat.label}</span>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};
