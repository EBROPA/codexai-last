
import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export const Process: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const { t } = useLanguage();

  return (
    <section className="py-20 md:py-32 border-t border-white/10 bg-black relative overflow-hidden">
      <div className="px-4 md:px-12 max-w-[90rem] mx-auto flex flex-col">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16">
           <div>
              <div className="font-mono text-neon-acid text-xs uppercase tracking-widest mb-4">
                {t.process.subtitle}
              </div>
              <h2 className="text-5xl md:text-8xl font-serif font-bold text-white uppercase tracking-tighter leading-none">
                {t.process.title} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-white">{t.process.titleHighlight}</span>
              </h2>
           </div>
           <div className="hidden md:block text-right max-w-xs">
             <p className="text-zinc-500 text-sm font-mono leading-relaxed">
               {t.process.desc}
             </p>
           </div>
        </div>

        {/* Accordion Container */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-2 h-auto md:h-[600px] w-full pb-8 md:pb-0">
          {t.process.steps.map((step, idx) => {
            const isActive = activeStep === idx;
            
            return (
              <div 
                key={idx}
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => {
                  if (window.innerWidth >= 768) setActiveStep(idx);
                }}
                className={`
                  relative overflow-hidden transition-all duration-500 ease-out cursor-pointer group border border-white/10
                  
                  /* Mobile Styles (Accordion) */
                  w-full
                  ${isActive ? 'h-auto bg-zinc-900 border-neon-acid/30' : 'h-[72px] bg-black hover:bg-zinc-900/50'}

                  /* Desktop Styles (Flex Expansion) */
                  md:h-auto md:flex md:flex-col
                  ${isActive ? 'md:flex-[3] md:bg-zinc-900' : 'md:flex-[1] md:bg-black'}
                `}
              >
                
                {/* --- MOBILE HEADER (Visible always) --- */}
                <div className="md:hidden flex items-center justify-between px-6 h-[72px] absolute top-0 left-0 w-full z-20">
                    <div className="flex items-center gap-4">
                        <span className={`font-mono text-lg ${isActive ? 'text-neon-acid' : 'text-zinc-600'}`}>{step.num}</span>
                        <span className={`font-serif text-lg font-bold uppercase ${isActive ? 'text-white' : 'text-zinc-400'}`}>{step.title}</span>
                    </div>
                    <ChevronDown 
                        size={20} 
                        className={`transition-transform duration-300 ${isActive ? 'rotate-180 text-neon-acid' : 'text-zinc-600'}`} 
                    />
                </div>

                {/* --- DESKTOP LARGE NUMBER BACKGROUND --- */}
                <div className={`
                  hidden md:block absolute -bottom-10 -right-10 text-[10rem] font-bold font-serif leading-none select-none transition-all duration-500 pointer-events-none
                  ${isActive ? 'text-white/5 translate-x-0' : 'text-transparent stroke-zinc-800 translate-x-10 opacity-20'}
                `}
                style={!isActive ? { WebkitTextStroke: '1px rgba(255,255,255,0.1)' } : {}}
                >
                  {step.num}
                </div>

                {/* --- DESKTOP VERTICAL TEXT (Collapsed) --- */}
                <div className={`
                  hidden md:flex absolute inset-0 items-center justify-center transition-opacity duration-300
                  ${isActive ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                `}>
                   <div className="rotate-90 whitespace-nowrap text-xl font-serif font-bold text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">
                      {step.title}
                   </div>
                </div>

                {/* --- CONTENT CONTAINER --- */}
                <div className={`
                  flex flex-col justify-between h-full relative z-10
                  
                  /* Mobile Padding */
                  pt-[72px] px-6 pb-8
                  ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none md:pointer-events-auto'}

                  /* Desktop Padding & Visibility */
                  md:pt-10 md:px-10 md:pb-10
                  ${isActive ? 'md:opacity-100' : 'md:opacity-0'}
                  
                  transition-opacity duration-500
                `}>
                  
                  {/* Desktop Header */}
                  <div className="hidden md:flex justify-between items-start">
                    <span className="font-mono text-neon-acid text-xl">
                      {step.num}
                    </span>
                    <ArrowRight className={`text-white transition-transform duration-300 ${isActive ? 'rotate-0' : '-rotate-45'}`} />
                  </div>

                  {/* Body Content */}
                  <div className="mt-0 md:mt-0">
                    <h3 className="hidden md:block text-2xl md:text-4xl font-serif font-bold text-white mb-2 uppercase">
                      {step.title}
                    </h3>
                    <div className="text-neon-acid font-mono text-xs uppercase tracking-widest mb-4 md:mb-6">
                      {step.subtitle}
                    </div>
                    <div className={`hidden md:block w-12 h-[1px] bg-white/20 mb-6 transition-all duration-700 ${isActive ? 'w-24 bg-neon-acid' : 'w-12'}`}></div>
                    <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
        
      </div>
    </section>
  );
};
