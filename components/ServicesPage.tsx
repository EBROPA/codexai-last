
import React from 'react';
import { ArrowRight, Layout, Bot, Brain, Shield, Rocket, Cpu, Database, ChevronRight, Terminal, Layers, Code2 } from 'lucide-react';
import { useRouter, useParams } from '../lib/router';
import { useLanguage } from '../lib/i18n';

// Mapping icons for usage with dynamic content
const ICONS = {
  web: <Layout className="text-neon-acid" size={48} />,
  bots: <Bot className="text-neon-acid" size={48} />,
  ai: <Brain className="text-neon-acid" size={48} />,
  complex: <Database className="text-neon-acid" size={48} />,
  tma: <Rocket className="text-neon-acid" size={48} />,
  reputation: <Shield className="text-neon-acid" size={48} />,
  custom: <Cpu className="text-neon-acid" size={48} />
};

export const ServicesPage: React.FC = () => {
  const router = useRouter();
  const params = useParams(); 
  const { slug } = params as { slug?: string }; 
  const { t } = useLanguage();

  // Find service in translations
  const serviceKey = (slug && t.servicesPage[slug as keyof typeof t.servicesPage]) 
    ? slug as keyof typeof t.servicesPage 
    : 'web';
    
  const activeService = t.servicesPage[serviceKey];
  const activeIcon = ICONS[serviceKey] || ICONS.web;

  // For the sidebar list, we iterate over the keys of servicesPage
  const serviceKeys = Object.keys(t.servicesPage) as Array<keyof typeof t.servicesPage>;

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4 md:px-12 flex flex-col lg:flex-row gap-12 relative overflow-hidden">
        
        {/* Decorative Background */}
        <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-neon-acid/5 blur-[150px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-neon-purple/5 blur-[150px] rounded-full pointer-events-none -z-10" />

        {/* Sidebar Nav */}
        <aside className="w-full lg:w-1/4 lg:sticky lg:top-32 self-start z-20">
             <div className="mb-8 font-mono text-neon-acid text-xs uppercase tracking-widest flex items-center gap-2">
                <Layers size={14} /> {t.services.titleHighlight}
             </div>
             
             {/* Desktop Sidebar / Mobile Horizontal Scroll */}
             <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 hide-scrollbar">
                {serviceKeys.map(key => (
                    <button
                        key={key}
                        onClick={() => router.push(`/services/${key}`)}
                        className={`
                            whitespace-nowrap px-4 py-3 text-left font-serif text-sm md:text-base border border-white/10 transition-all duration-300
                            ${serviceKey === key 
                                ? 'bg-white text-black border-white' 
                                : 'bg-black text-zinc-500 hover:text-white hover:border-white/30'}
                        `}
                    >
                        {t.servicesPage[key].title}
                    </button>
                ))}
             </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 z-10 animate-float-in">
             {/* Header */}
             <div className="mb-16 border-b border-white/10 pb-12">
                 <div className="flex items-center gap-4 mb-6">
                     <div className="p-3 bg-zinc-900 border border-white/10 rounded-full text-neon-acid">
                         {activeIcon}
                     </div>
                     <span className="font-mono text-xs text-neon-acid uppercase tracking-widest px-3 py-1 bg-neon-acid/10 rounded-full border border-neon-acid/20">
                         {activeService.subtitle}
                     </span>
                 </div>
                 
                 <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-[0.9] tracking-tighter">
                     {activeService.title}
                 </h1>
                 
                 <p className="text-zinc-400 font-sans text-lg md:text-xl leading-relaxed max-w-2xl">
                     {activeService.description}
                 </p>
             </div>

             {/* Features Grid */}
             <div className="grid md:grid-cols-2 gap-8 mb-20">
                 {activeService.features.map((feature, idx) => (
                     <div key={idx} className="bg-zinc-950/50 border border-white/10 p-8 hover:border-neon-acid/30 transition-colors group">
                         <div className="font-mono text-neon-acid text-xs uppercase tracking-widest mb-2">0{idx + 1}</div>
                         <h3 className="text-2xl font-serif font-bold text-white mb-1 group-hover:text-neon-acid transition-colors">{feature.title}</h3>
                         <p className="text-zinc-500 text-xs uppercase tracking-wide mb-6">{feature.desc}</p>
                         <ul className="space-y-3">
                             {feature.points.map((point, pIdx) => (
                                 <li key={pIdx} className="flex items-start gap-3 text-sm text-zinc-300">
                                     <ChevronRight size={16} className="text-neon-acid mt-0.5 shrink-0" />
                                     <span>{point}</span>
                                 </li>
                             ))}
                         </ul>
                     </div>
                 ))}
             </div>

             {/* Workflow Section */}
             <div className="mb-20">
                 <h2 className="text-3xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                    <Terminal size={24} className="text-zinc-500" />
                    {t.process.title}
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                     {activeService.workflow.map((flow, idx) => (
                         <div key={idx} className="bg-zinc-900 p-6 border-l-2 border-neon-acid/20 hover:border-neon-acid transition-colors">
                             <div className="font-mono text-xl text-zinc-600 mb-2">{flow.step}</div>
                             <h4 className="font-bold text-white mb-2">{flow.title}</h4>
                             <p className="text-xs text-zinc-400 leading-relaxed">{flow.desc}</p>
                         </div>
                     ))}
                 </div>
             </div>

             {/* Tech Stack */}
             <div className="mb-20 bg-zinc-950 border border-white/10 p-8">
                 <h2 className="text-xl font-mono text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <Code2 size={18} /> Tech Stack
                 </h2>
                 <div className="flex flex-wrap gap-3">
                     {activeService.techStack.map((tech, idx) => (
                         <span key={idx} className="px-4 py-2 bg-black border border-white/10 text-zinc-300 font-mono text-xs uppercase hover:text-neon-acid hover:border-neon-acid transition-colors cursor-default">
                             {tech}
                         </span>
                     ))}
                 </div>
             </div>

             {/* CTA */}
             <div className="flex justify-end">
                <button 
                    onClick={() => router.push('/contact')}
                    className="group relative px-10 py-6 bg-neon-acid text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-white transition-colors overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        {t.contact.form.submit} <ArrowRight size={18} />
                    </span>
                </button>
             </div>
        </div>
    </div>
  );
};
