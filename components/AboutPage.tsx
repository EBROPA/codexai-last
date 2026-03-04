import React from 'react';
import { SEO } from './SEO';
import { useLanguage } from '../lib/i18n';
import { Contact } from './Contact';
import { AboutHeroVisual } from './AboutHeroVisual';
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
            <section className="min-h-screen pt-32 pb-20 px-4 md:px-12 bg-black text-white relative overflow-hidden flex items-center">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

                {/* Deep Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-neon-acid/5 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-[90rem] mx-auto relative z-10 w-full h-full">
                    {/* Desktop Grid Layout */}
                    <div className="hidden lg:grid lg:grid-cols-2 gap-20 items-center min-h-[calc(100vh-200px)]">
                        {/* Left: Text Content */}
                        <div className="relative">
                            <div className="inline-flex items-center gap-3 px-4 py-2 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <span className="w-2 h-2 rounded-full bg-neon-acid animate-pulse"></span>
                                <span className="font-mono text-xs uppercase tracking-widest">{t.aboutPage.hero.subtitle}</span>
                            </div>

                            <h1 className="text-7xl xl:text-9xl font-serif font-bold leading-[0.9] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                {t.aboutPage.hero.title}
                            </h1>

                            <div className="max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                                <p className="text-zinc-400 font-sans text-xl leading-relaxed border-l-2 border-neon-acid pl-6">
                                    {t.aboutPage.hero.desc}
                                </p>

                                <div className="mt-12 flex flex-wrap gap-8 font-mono text-xs tracking-widest text-zinc-500">
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-neon-acid rounded-full"></span>
                                        EST. 2024
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-neon-acid rounded-full"></span>
                                        GLOBAL
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-neon-acid rounded-full"></span>
                                        PREMIUM
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Visual */}
                        <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
                            <AboutHeroVisual />
                        </div>
                    </div>

                    {/* Mobile Poster Layout */}
                    <div className="lg:hidden flex flex-col justify-between min-h-[80vh] py-4 relative z-20">
                        {/* TOP: Badge + Title */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-acid animate-pulse"></span>
                                <span className="font-mono text-[10px] uppercase tracking-widest">{t.aboutPage.hero.subtitle}</span>
                            </div>

                            <h1 className="text-5xl sm:text-6xl font-serif font-bold leading-[0.9] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                {/* Split title manual formatting for impact if manageable, or just render */}
                                <span className="block">{t.aboutPage.hero.title}</span>
                            </h1>
                        </div>

                        {/* CENTER: Subtle Filler */}
                        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
                            {/* Subtle Ambient Glow */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-64 h-64 bg-neon-acid/5 rounded-full blur-[80px] animate-pulse"></div>
                                <div className="absolute w-32 h-32 bg-neon-acid/10 rounded-full blur-[40px] animate-[pulse_4s_ease-in-out_infinite]"></div>
                            </div>

                            {/* Minimal Decorative Line */}
                            <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
                        </div>

                        {/* BOTTOM: Description + Footer Badges */}
                        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                            <div className="flex items-start gap-4 mb-8">
                                <div className="w-1 h-full min-h-[60px] bg-neon-acid shrink-0"></div>
                                <p className="text-zinc-300 font-sans text-lg leading-relaxed">
                                    {t.aboutPage.hero.desc}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[10px] tracking-widest text-zinc-500 border-t border-white/10 pt-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-neon-acid rounded-full"></span>
                                    EST. 2024
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-neon-acid rounded-full"></span>
                                    GLOBAL
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-1 h-1 bg-neon-acid rounded-full"></span>
                                    PREMIUM
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Manifesto Section */}
            <section className="py-24 bg-zinc-950 text-white px-4 md:px-12 border-t border-white/20">
                <div className="max-w-[90rem] mx-auto">
                    <div className="mb-16 flex items-end justify-between">
                        <h2 className="text-4xl md:text-6xl font-serif font-bold">{t.aboutPage.manifesto.title}</h2>
                        <ArrowDown className="text-neon-acid w-12 h-12 animate-bounce hidden md:block" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {t.aboutPage.manifesto.items.map((item, idx) => (
                            <div key={idx} className="group p-8 border border-white/20 hover:border-neon-acid/50 transition-all duration-300 bg-zinc-900/40 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                                <div className="font-mono text-neon-acid text-sm mb-6">0{idx + 1}</div>
                                <h3 className="text-2xl font-serif font-bold mb-4 group-hover:text-neon-acid transition-colors">{item.title}</h3>
                                <p className="text-zinc-300 leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-black text-white px-4 md:px-12 border-t border-white/20">
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
            <section className="py-24 bg-zinc-950 text-white px-4 md:px-12 border-t border-white/20">
                <div className="max-w-[90rem] mx-auto grid md:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8">
                            {t.aboutPage.team.title}
                        </h2>
                        <p className="text-zinc-300 text-lg leading-relaxed mb-12">
                            {t.aboutPage.team.desc}
                        </p>

                        <div className="space-y-6">
                            <div className="border-l border-white/20 pl-6">
                                <h4 className="font-mono text-neon-acid text-sm uppercase tracking-widest mb-2">Development</h4>
                                <p className="text-zinc-300">Next.js, React, Python, Node.js, PostgreSQL, Docker</p>
                            </div>
                            <div className="border-l border-white/20 pl-6">
                                <h4 className="font-mono text-neon-acid text-sm uppercase tracking-widest mb-2">AI & ML</h4>
                                <p className="text-zinc-300">OpenAI API, LangChain, TensorFlow, Computer Vision</p>
                            </div>
                            <div className="border-l border-white/20 pl-6">
                                <h4 className="font-mono text-neon-acid text-sm uppercase tracking-widest mb-2">Infrastructure</h4>
                                <p className="text-zinc-300">AWS, DigitalOcean, Kubernetes, CI/CD Pipelines</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-[4/3] bg-zinc-900/60 border border-white/20 p-6 flex flex-col justify-between hover:border-neon-acid/50 transition-all duration-300 group shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                                <div className="font-mono text-xs text-zinc-500">SENIOR</div>
                                <div className="text-2xl font-serif font-bold group-hover:text-neon-acid transition-colors">Frontend</div>
                            </div>
                            <div className="aspect-[4/3] bg-zinc-900/60 border border-white/20 p-6 flex flex-col justify-between hover:border-neon-acid/50 transition-all duration-300 group shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                                <div className="font-mono text-xs text-zinc-500">SENIOR</div>
                                <div className="text-2xl font-serif font-bold group-hover:text-neon-acid transition-colors">Backend</div>
                            </div>
                            <div className="aspect-[4/3] bg-zinc-900/60 border border-white/20 p-6 flex flex-col justify-between hover:border-neon-acid/50 transition-all duration-300 group shadow-[0_0_20px_rgba(255,255,255,0.02)]">
                                <div className="font-mono text-xs text-zinc-500">LEAD</div>
                                <div className="text-2xl font-serif font-bold group-hover:text-neon-acid transition-colors">Design</div>
                            </div>
                            <div className="aspect-[4/3] bg-zinc-900/60 border border-white/20 p-6 flex flex-col justify-between hover:border-neon-acid/50 transition-all duration-300 group shadow-[0_0_20px_rgba(255,255,255,0.02)]">
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
