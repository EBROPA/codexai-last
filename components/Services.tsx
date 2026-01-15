
import React, { useState } from 'react';
import { ArrowRight, Layout, Bot, Brain, Database, Rocket, Shield, Cpu } from 'lucide-react';
import { useRouter } from '../lib/router';
import { useLanguage } from '../lib/i18n';

export const Services: React.FC = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const router = useRouter();
  const { t } = useLanguage();

  const services = [
    {
        id: '/services/web',
        title: t.services.items.web.title,
        desc: t.services.items.web.desc,
        icon: <Layout className="text-neon-acid" size={24} />
    },
    {
        id: '/services/bots',
        title: t.services.items.bots.title,
        desc: t.services.items.bots.desc,
        icon: <Bot className="text-neon-acid" size={24} />
    },
    {
        id: '/services/ai',
        title: t.services.items.ai.title,
        desc: t.services.items.ai.desc,
        icon: <Brain className="text-neon-acid" size={24} />
    },
    {
        id: '/services/complex',
        title: t.services.items.complex.title,
        desc: t.services.items.complex.desc,
        icon: <Database className="text-neon-acid" size={24} />
    },
    {
        id: '/services/tma',
        title: t.services.items.tma.title,
        desc: t.services.items.tma.desc,
        icon: <Rocket className="text-neon-acid" size={24} />
    },
    {
        id: '/services/reputation',
        title: t.services.items.reputation.title,
        desc: t.services.items.reputation.desc,
        icon: <Shield className="text-neon-acid" size={24} />
    },
    {
        id: '/services/custom',
        title: t.services.items.custom.title,
        desc: t.services.items.custom.desc,
        icon: <Cpu className="text-neon-acid" size={24} />
    }
  ];

  return (
    <section className="py-32 bg-black border-t border-white/10 relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="px-4 md:px-12 max-w-[90rem] mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div>
                <div className="font-mono text-neon-acid text-xs uppercase tracking-widest mb-4">
                    {t.services.subtitle}
                </div>
                <h2 className="text-6xl md:text-8xl font-serif font-bold text-white uppercase tracking-tighter">
                    {t.services.title} <span className="text-neon-acid">{t.services.titleHighlight}</span>
                </h2>
            </div>
            <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest max-w-md text-right">
                {t.services.desc}
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {services.map((service, index) => {
             // Create a bento-like grid where the last item spans full width on lg screens
             const isLast = index === services.length - 1;
             
             return (
              <button 
                key={service.id}
                onClick={() => router.push(service.id)}
                onMouseEnter={() => setHoveredId(service.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`
                  relative flex flex-col justify-between p-8 md:p-12 border border-white/10 bg-zinc-950/50 
                  transition-all duration-500 group text-left cursor-pointer
                  ${isLast ? 'lg:col-span-3 lg:flex-row lg:items-center' : ''}
                  hover:bg-zinc-900 hover:border-white/30
                `}
              >
                <div className="flex items-start justify-between w-full mb-8 lg:mb-0 lg:w-auto lg:gap-8">
                   <div className="p-3 border border-white/10 rounded-full bg-black group-hover:border-neon-acid transition-colors">
                      {service.icon}
                   </div>
                   {isLast && (
                       <div className="hidden lg:block h-px w-32 bg-white/10 group-hover:bg-neon-acid/50 transition-colors"></div>
                   )}
                </div>

                <div className={`${isLast ? 'lg:flex-1 lg:flex lg:items-center lg:justify-between' : ''}`}>
                   <div>
                       <h3 className="text-3xl font-serif font-bold text-white mb-2 group-hover:text-neon-acid transition-colors">
                         {service.title}
                       </h3>
                       <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                         {service.desc}
                       </p>
                   </div>
                   
                   <div className={`mt-8 ${isLast ? 'lg:mt-0' : ''}`}>
                       <div className="flex items-center gap-2 text-sm text-zinc-400 font-mono group-hover:text-white transition-colors group-hover:translate-x-2 duration-300">
                           <span className="uppercase tracking-widest">{t.services.details}</span>
                           <ArrowRight size={14} />
                       </div>
                   </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
