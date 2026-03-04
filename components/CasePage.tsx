
import React from 'react';
import { useParams, useRouter } from '../lib/router';
import { getProjects } from './Portfolio';
import { useLanguage } from '../lib/i18n';
import { ArrowLeft, ArrowUpRight, Calendar, Layers, CheckCircle } from 'lucide-react';
import { OptimizedImage } from './Image';
import { SeamlessPDFViewer } from './SeamlessPDFViewer';

export const CasePage: React.FC = () => {
    const { slug } = useParams();
    const router = useRouter();
    const { t, lang } = useLanguage();
    const projects = getProjects(lang);

    const project = projects.find(p => p.slug === slug);

    if (!project) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-serif mb-4">Case Not Found</h1>
                    <button onClick={() => router.push('/work')} className="text-neon-acid hover:underline">
                        Back to Work
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-black min-h-screen text-white pt-32 pb-20">
            {/* Header / Navigation */}
            <div className="px-4 md:px-12 mb-12">
                <button
                    onClick={() => router.push('/work')}
                    className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-xs uppercase tracking-widest">Back to Portfolio</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 border border-neon-acid text-neon-acid text-[10px] font-mono uppercase tracking-widest rounded-full">
                                {project.category}
                            </span>
                            <span className="text-zinc-500 font-mono text-xs">{project.year}</span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-serif uppercase leading-none tracking-tighter text-white">
                            {project.title}
                        </h1>
                    </div>

                </div>
            </div>

            <div className="w-full">
                <div className="w-full relative">
                    {/* PDF/Image Display - Full width, seamless */}
                    <div className="relative w-full">
                        {project.pdf ? (
                            <SeamlessPDFViewer pdfUrl={project.pdf} />
                        ) : (
                            // Fallback to Image if no PDF
                            <div className="w-full h-screen relative">
                                <OptimizedImage
                                    src={project.image || '/img/codexai-logo.png'}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/20" />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats & Details Grid */}
            <div className="px-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 mb-32">

                {/* Left Column: Context */}
                <div className="col-span-1 border-r border-white/10 pr-8 hidden md:block">
                    <div className="sticky top-40 space-y-12">
                        <div>
                            <div className="flex items-center gap-2 text-neon-acid mb-2">
                                <Layers size={16} />
                                <h3 className="font-mono text-xs uppercase tracking-widest">Niche</h3>
                            </div>
                            <p className="text-xl font-serif text-white">{project.niche}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-neon-acid mb-2">
                                <Calendar size={16} />
                                <h3 className="font-mono text-xs uppercase tracking-widest">Year</h3>
                            </div>
                            <p className="text-xl font-serif text-white">{project.year}</p>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 text-neon-acid mb-2">
                                <CheckCircle size={16} />
                                <h3 className="font-mono text-xs uppercase tracking-widest">Result</h3>
                            </div>
                            <p className="text-lg text-zinc-300">{project.result}</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Content */}
                <div className="col-span-1 md:col-span-2">
                    <div className="space-y-16">
                        {/* Task Section */}
                        <section>
                            <h2 className="text-3xl font-serif text-white mb-6 flex items-center gap-3">
                                <span className="text-neon-acid">//</span> {t.portfolio.task}
                            </h2>
                            <p className="text-xl md:text-2xl text-zinc-300 leading-relaxed font-light">
                                {project.task}
                            </p>
                        </section>

                        {/* Stats Section */}
                        {project.stats && (
                            <section className="grid grid-cols-2 md:grid-cols-3 gap-4 border-y border-white/10 py-12">
                                {project.stats.map((stat, i) => (
                                    <div key={i} className="p-6 bg-zinc-900/30 border border-white/5">
                                        <div className="text-4xl md:text-5xl font-serif text-neon-acid mb-2">{stat.value}</div>
                                        <div className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-1">{stat.label}</div>
                                        {stat.period && <div className="text-[10px] text-zinc-600 font-mono">{stat.period}</div>}
                                    </div>
                                ))}
                            </section>
                        )}

                        {/* Mock Description (Since we don't have it in data yet, using generic text or maybe user will add later) */}
                        <section>
                            <h2 className="text-3xl font-serif text-white mb-6 flex items-center gap-3">
                                <span className="text-neon-acid">//</span> Process & Solution
                            </h2>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-6">
                                {lang === 'ru'
                                    ? "Мы провели глубокий анализ рынка и конкурентов, чтобы создать уникальное визуальное решение. Интерфейс разработан с учетом поведенческих факторов целевой аудитории, что позволило достичь высоких показателей конверсии."
                                    : "We conducted a deep analysis of the market and competitors to create a unique visual solution. The interface was designed taking into account the behavioral factors of the target audience, which allowed us to achieve high conversion rates."
                                }
                            </p>
                            <p className="text-zinc-400 text-lg leading-relaxed">
                                {lang === 'ru'
                                    ? "Техническая реализация выполнена на современном стеке технологий, обеспечивая мгновенную загрузку и плавные анимации. Это не просто сайт, а эффективный инструмент для бизнеса."
                                    : "The technical implementation was carried out on a modern technology stack, ensuring instant loading and smooth animations. It is not just a website, but an effective tool for business."
                                }
                            </p>
                        </section>

                    </div>
                </div>
            </div>

            <div className="px-4 md:px-12 flex justify-center pt-20 border-t border-white/10">
                <button
                    onClick={() => router.push('/work')}
                    className="group relative px-12 py-6 border border-white/20 hover:border-neon-acid transition-colors duration-300 overflow-hidden"
                >
                    <span className="relative z-10 font-mono text-xs uppercase tracking-widest group-hover:text-neon-acid transition-colors">
                        Next Project
                    </span>
                    <div className="absolute inset-0 bg-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-0"></div>
                </button>
            </div>

        </div>
    );
};
