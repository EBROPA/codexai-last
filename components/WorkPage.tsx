


import React, { useState } from 'react';
import { getProjects, PortfolioCard } from './Portfolio';
import { ArrowDown, Star, Globe, Trophy } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { useRouter } from '../lib/router';

export const WorkPage: React.FC = () => {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const projects = getProjects(lang);
    
    const [filter, setFilter] = useState('ALL');
    const categories = ['ALL', 'E-COMMERCE', 'FINTECH', 'CULTURE', 'BEAUTY'];

    // Stats Data
    const stats = [
        { label: t.workPage.stats.completed, value: "45+", icon: <Globe className="text-neon-acid mb-2" /> },
        { label: t.workPage.stats.awards, value: "12", icon: <Trophy className="text-neon-acid mb-2" /> },
        { label: t.workPage.stats.years, value: "3", icon: <Star className="text-neon-acid mb-2" /> },
    ];

    // Filter Logic
    const filteredProjects = filter === 'ALL' 
        ? projects 
        : projects.filter(p => {
             // Simple mapping for categories logic
             if (filter === 'E-COMMERCE') return p.category === 'Fashion Store' || p.category === 'HoReCa';
             if (filter === 'FINTECH') return p.category === 'SaaS / IT' || p.category === 'Marketing Ecosystem';
             if (filter === 'CULTURE') return p.category === 'Event / Entertainment';
             if (filter === 'BEAUTY') return p.category === 'Fashion Store';
             return true;
        });

    return (
        <div className="bg-void min-h-screen pt-32 pb-20 text-white">
            
            {/* Header Section */}
            <div className="px-4 md:px-12 mb-20">
                 <div className="grid md:grid-cols-2 gap-12 items-end border-b border-white/10 pb-12">
                     <div>
                        <div className="font-mono text-neon-acid text-xs uppercase tracking-widest mb-4">
                             // Archive 2023-2024
                        </div>
                        <h1 className="text-6xl md:text-9xl font-serif font-bold leading-[0.9] tracking-tighter">
                            SELECTED <br/> WORKS
                        </h1>
                     </div>
                     <div className="flex flex-col gap-8">
                         <p className="text-zinc-400 font-mono text-sm leading-relaxed max-w-md uppercase tracking-wide">
                             {t.workPage.subtitle}
                         </p>
                         
                         {/* Stats Row */}
                         <div className="flex gap-12 border-t border-white/10 pt-8">
                             {stats.map((stat, idx) => (
                                 <div key={idx}>
                                     <div className="text-2xl md:text-3xl font-serif font-bold text-white">{stat.value}</div>
                                     <div className="text-[10px] font-mono text-zinc-500 uppercase mt-1">{stat.label}</div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>

                 {/* Filters */}
                 <div className="mt-8 flex flex-wrap gap-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`
                                text-[10px] md:text-xs font-mono uppercase px-4 py-2 border rounded-full transition-all duration-300
                                ${filter === cat 
                                    ? 'bg-neon-acid text-black border-neon-acid' 
                                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-white hover:text-white'}
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Projects Grid with Masonry Effect */}
            <div className="px-4 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32 mb-32">
                {filteredProjects.map((project, index) => (
                    <div 
                        key={project.id} 
                        className={`
                            ${index % 2 === 1 ? 'md:mt-32' : ''} 
                            transition-all duration-700
                        `}
                    >
                       <PortfolioCard project={project} index={index} t={t} />
                       
                       {/* Additional Details for Work Page */}
                       <div className="mt-6 border-t border-white/5 pt-4">
                           <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2">
                               <span>Services:</span>
                               <span>Year:</span>
                           </div>
                           <div className="flex justify-between text-xs font-mono text-zinc-300 uppercase">
                               <span>UI/UX • Development • Strategy</span>
                               <span>{project.year}</span>
                           </div>
                       </div>
                    </div>
                ))}
            </div>

            {/* Clients List */}
            <div className="px-4 md:px-12 border-t border-white/10 pt-20">
                <h3 className="text-xl font-serif text-zinc-500 mb-12">Select Clients</h3>
                <div className="flex flex-wrap gap-x-16 gap-y-8 font-mono text-lg md:text-2xl text-zinc-700 uppercase leading-none select-none">
                    {["Google", "Yandex", "Sber", "VTB", "Gazprom", "MTS", "Megafon", "Avito", "Tinkoff", "Alpha"].map((client, i) => (
                        <span key={i} className="hover:text-white transition-colors cursor-default duration-300">{client}</span>
                    ))}
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="mt-32 px-4 md:px-12 py-20 bg-zinc-900/30 border-y border-white/10 text-center">
                <div 
                    onClick={() => router.push('/contact')}
                    className="inline-block relative group cursor-pointer"
                >
                    <p className="text-zinc-500 font-mono text-xs uppercase mb-4 tracking-widest">{t.workPage.cta.text}</p>
                    <h2 className="text-5xl md:text-8xl font-serif text-white hover:text-neon-acid transition-colors duration-500">
                        {t.workPage.cta.btn}
                    </h2>
                </div>
            </div>
        </div>
    );
};