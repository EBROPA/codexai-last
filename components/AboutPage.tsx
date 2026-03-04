import React from 'react';
import { SEO } from './SEO';
import { useLanguage } from '../lib/i18n';
import { Contact } from './Contact';
import { ArrowDown } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const title = lang === 'ru' ? 'О компании — гарантии и экспертиза' : 'About — Guarantees and Expertise';
  const description = lang === 'ru'
      ? 'Работаем по договору, соблюдаем сроки, даем гарантию на код 12 месяцев. Senior‑команда и прозрачные процессы.'
      : 'Contract-based delivery, on-time launches, and a 12‑month code warranty. Senior team and transparent process.';

  return (
    <>
      <SEO title={title} description={description} path="/about" />
      
      {/* Hero Section */}
      <section className="min-h-screen pt-32 pb-20 px-4 md:px-12 bg-black text-white relative overflow-hidden">
        <div className="max-w-[90rem] mx-auto relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-neon-acid animate-pulse"></span>
              <span className="font-mono text-xs uppercase tracking-widest">{t.aboutPage.hero.subtitle}</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif font-bold leading-[0.9] tracking-tighter mb-12">
              {t.aboutPage.hero.title}
            </h1>

            <div className="max-w-2xl">
                <p className="text-zinc-400 font-sans text-xl leading-relaxed border-l-2 border-neon-acid pl-6">
                    {t.aboutPage.hero.desc}
                </p>
            </div>
        </div>

        {/* Decorative Background */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-neon-acid/5 blur-[120px] rounded-full pointer-events-none"></div>
      </section>

      {/* Manifesto Section */}
      <section className="py-24 bg-zinc-950 text-white px-4 md:px-12 border-t border-white/10">
        <div className="max-w-[90rem] mx-auto">
            <div className="mb-16 flex items-end justify-between">
                <h2 className="text-4xl md:text-6xl font-serif font-bold">{t.aboutPage.manifesto.title}</h2>
                <ArrowDown className="text-neon-acid w-12 h-12 animate-bounce hidden md:block" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {t.aboutPage.manifesto.items.map((item, idx) => (
                    <div key={idx} className="group p-8 border border-white/10 hover:border-neon-acid/50 transition-colors duration-500 bg-black">
                        <div className="font-mono text-neon-acid text-sm mb-6">0{idx + 1}</div>
                        <h3 className="text-2xl font-serif font-bold mb-4 group-hover:text-neon-acid transition-colors">{item.title}</h3>
                        <p className="text-zinc-400 leading-relaxed">
                            {item.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-black text-white px-4 md:px-12 border-t border-white/10">
         <div className="max-w-[90rem] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {t.aboutPage.stats.items.map((stat, idx) => (
                    <div key={idx} className="text-center md:text-left">
                        <div className="text-5xl md:text-7xl font-serif font-bold text-white mb-2">{stat.val}</div>
                        <div className="text-xs font-mono uppercase tracking-widest text-zinc-500">{stat.label}</div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Team / Philosophy Text */}
      <section className="py-24 bg-zinc-950 text-white px-4 md:px-12 border-t border-white/10">
         <div className="max-w-[90rem] mx-auto grid md:grid-cols-2 gap-16 items-start">
            <div>
                <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">
                    {t.aboutPage.team.title}
                </h2>
                <p className="text-zinc-400 text-lg leading-relaxed mb-12">
                    {t.aboutPage.team.desc}
                </p>
                
                <div className="space-y-6">
                    <div className="border-l border-white/10 pl-6">
                        <h4 className="font-mono text-neon-acid text-sm uppercase tracking-widest mb-2">Development</h4>
                        <p className="text-zinc-300">Next.js, React, Python, Node.js, PostgreSQL, Docker</p>
                    </div>
                    <div className="border-l border-white/10 pl-6">
                         <h4 className="font-mono text-neon-acid text-sm uppercase tracking-widest mb-2">AI & ML</h4>
                         <p className="text-zinc-300">OpenAI API, LangChain, TensorFlow, Computer Vision</p>
                    </div>
                    <div className="border-l border-white/10 pl-6">
                         <h4 className="font-mono text-neon-acid text-sm uppercase tracking-widest mb-2">Infrastructure</h4>
                         <p className="text-zinc-300">AWS, DigitalOcean, Kubernetes, CI/CD Pipelines</p>
                    </div>
                </div>
            </div>
            
            <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                    <div className="aspect-[4/3] bg-zinc-900 border border-white/5 p-6 flex flex-col justify-between hover:border-neon-acid/50 transition-colors group">
                         <div className="font-mono text-xs text-zinc-500">SENIOR</div>
                         <div className="text-2xl font-serif font-bold group-hover:text-neon-acid transition-colors">Frontend</div>
                    </div>
                    <div className="aspect-[4/3] bg-zinc-900 border border-white/5 p-6 flex flex-col justify-between hover:border-neon-acid/50 transition-colors group">
                         <div className="font-mono text-xs text-zinc-500">SENIOR</div>
                         <div className="text-2xl font-serif font-bold group-hover:text-neon-acid transition-colors">Backend</div>
                    </div>
                    <div className="aspect-[4/3] bg-zinc-900 border border-white/5 p-6 flex flex-col justify-between hover:border-neon-acid/50 transition-colors group">
                         <div className="font-mono text-xs text-zinc-500">LEAD</div>
                         <div className="text-2xl font-serif font-bold group-hover:text-neon-acid transition-colors">Design</div>
                    </div>
                    <div className="aspect-[4/3] bg-zinc-900 border border-white/5 p-6 flex flex-col justify-between hover:border-neon-acid/50 transition-colors group">
                         <div className="font-mono text-xs text-zinc-500">LEAD</div>
                         <div className="text-2xl font-serif font-bold group-hover:text-neon-acid transition-colors">DevOps</div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      <Contact />
    </>
  );
};
