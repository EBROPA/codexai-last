
import React, { useRef, useState, useEffect } from 'react';
import { Project } from '../types';
import { ArrowUpRight, ChevronLeft, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from '../lib/router';
import { useLanguage } from '../lib/i18n';
import { OptimizedImage } from './Image';

// Import portfolio images
import kingsleyImg from '../img/portfolio/kinhsley_optimized.png';
import betterSlayImg from '../img/portfolio/hype_awards_optimized.png';
import aurumImg from '../img/portfolio/aurum_optimized.png';
import secureImg from '../img/portfolio/crimson_optimized.png';
import merenCoffeeImg from '../img/portfolio/meren_coffee_optimized.png';
import capitalCoreImg from '../img/portfolio/capital_core_optimized.png';
import dmleadsImg from '../img/portfolio/dmleads_optimized.png';

export interface ProjectData extends Project {
    niche: string;
    task: string;
    result: string;
}

export const getProjects = (lang: string): ProjectData[] => [
    { 
      id: 1, 
      title: "KINGSLEY", 
      category: "Real Estate",
      niche: lang === 'ru' ? "Элитная недвижимость" : "Luxury Real Estate",
      task: lang === 'ru' ? "Сайт для агентства элитной недвижимости." : "Website for luxury real estate agency.",
      result: lang === 'ru' ? "Привлечение VIP-клиентов и заявок." : "Attracting VIP clients and leads.",
      image: kingsleyImg, 
      url: "https://kingsley-new.vercel.app/",
      year: "2025" 
    },
    { 
      id: 2, 
      title: "BETTER SLAY", 
      category: "Event / Entertainment", 
      niche: lang === 'ru' ? "Мероприятие" : "Event",
      task: lang === 'ru' ? "Сделать смешной сайт для мероприятия." : "Make a funny website for an event.",
      result: lang === 'ru' ? "Разогрело и рассмешило аудиторию." : "Engaged and entertained the audience.",
      image: betterSlayImg, 
      url: "https://better-slay-obem.vercel.app/",
      year: "2025" 
    },
    { 
      id: 3, 
      title: "AURUM", 
      category: "Fashion Store", 
      niche: lang === 'ru' ? "Дизайнерская одежда" : "Designer Clothes",
      task: lang === 'ru' ? "Создание имиджевого интернет-магазина." : "Creating an image e-commerce store.",
      result: lang === 'ru' ? "Успешный запуск онлайн-продаж." : "Successful launch of online sales.",
      image: aurumImg, 
      url: "https://aurumfashion.vercel.app/",
      year: "2025" 
    },
    { 
      id: 4, 
      title: "SECURE", 
      category: "SaaS / IT", 
      niche: lang === 'ru' ? "Кибербезопасность" : "Cybersecurity",
      task: lang === 'ru' ? "Лендинг сложного технологического продукта." : "Landing page for complex tech product.",
      result: lang === 'ru' ? "Высокая конверсия в демо-версию." : "High conversion to demo.",
      image: secureImg, 
      url: "https://sec-uwtt.vercel.app/",
      year: "2025" 
    },
    { 
      id: 5, 
      title: "MERIN COFFEE", 
      category: "HoReCa", 
      niche: lang === 'ru' ? "Кофейня" : "Coffee Shop",
      task: lang === 'ru' ? "Атмосферный промо-сайт." : "Atmospheric promo site.",
      result: lang === 'ru' ? "Рост узнаваемости и трафика с карт." : "Growth in recognition and map traffic.",
      image: merenCoffeeImg, 
      url: "https://merincoffe.vercel.app/",
      year: "2025" 
    },
    { 
      id: 6, 
      title: "CAPITAL CORE", 
      category: "Commercial Real Estate", 
      niche: lang === 'ru' ? "Коммерческая недвижимость" : "Commercial Real Estate",
      task: lang === 'ru' ? "Сайт для агентства коммерческой недвижимости." : "Website for commercial real estate agency.",
      result: lang === 'ru' ? "Рост доверия корпоративных клиентов." : "Growth of corporate trust.",
      image: capitalCoreImg, 
      url: "https://capital-core-2i83.vercel.app/",
      year: "2024" 
    },
    { 
      id: 7, 
      title: "DM LEADS", 
      category: "Marketing Ecosystem",
      niche: lang === 'ru' ? "Лидогенерация" : "Lead Generation",
      task: lang === 'ru' ? "Разработка двух сайтов (RU/Global) для масштабирования." : "Development of two websites (RU/Global) for scaling.",
      result: lang === 'ru' ? "Успешный запуск в 2 регионах." : "Successful launch in 2 regions.",
      image: dmleadsImg, 
      url: "https://dmleads.ru/",
      year: "2024" 
    },
  ];

export const Portfolio: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t, lang } = useLanguage();

  const projects = getProjects(lang);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = window.innerWidth * 0.6;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-32 border-b border-black/10 bg-zinc-950 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-acid/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="px-4 md:px-12 mb-16 flex flex-col md:flex-row md:items-end justify-between relative z-10 gap-8">
        <div>
           <div className="font-mono text-neon-acid text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="animate-pulse">●</span> {t.portfolio.selectedWorks}
           </div>
           <h2 className="text-6xl md:text-9xl font-serif text-white uppercase tracking-tighter leading-none relative z-10">
             {t.portfolio.title} <br/><span className="text-zinc-500">{t.portfolio.titleHighlight}</span>
           </h2>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => scroll('left')}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 group"
          >
            <ChevronLeft size={24} className="text-white group-hover:text-black group-hover:-translate-x-1 transition-transform" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-neon-acid hover:text-black hover:border-neon-acid transition-all duration-300 group"
          >
            <ChevronRight size={24} className="text-white group-hover:text-black group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex overflow-x-auto gap-8 md:gap-12 px-4 md:px-12 pb-20 snap-x snap-mandatory hide-scrollbar scroll-smooth"
      >
        {projects.map((project, i) => (
          <PortfolioCard key={project.id} project={project} index={i} t={t} />
        ))}
        <div className="flex-none w-12 md:w-24"></div>
      </div>
      
      <div className="px-4 md:px-12 flex justify-center">
         <button 
            onClick={() => router.push('/work')}
            className="group relative flex items-center gap-6 px-12 py-8 border border-white/10 hover:border-neon-acid transition-colors duration-500 bg-zinc-900/50 backdrop-blur-sm overflow-hidden"
         >
            <div className="absolute inset-0 bg-neon-acid/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]"></div>
            
            <span className="relative z-10 font-serif text-2xl md:text-3xl italic text-white group-hover:text-neon-acid transition-colors">
                {t.portfolio.btnAll}
            </span>
            
            <div className="relative z-10 w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-neon-acid group-hover:border-neon-acid transition-all duration-500">
                 <ArrowRight className="w-5 h-5 text-white group-hover:text-black transform group-hover:-rotate-45 transition-transform duration-500" />
            </div>
         </button>
      </div>
    </section>
  );
};

export const PortfolioCard: React.FC<{ project: ProjectData, index: number, t: any }> = ({ project, index, t }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div className="snap-center flex-none w-[90vw] md:w-[60vw] lg:w-[45vw] flex flex-col group perspective-[1000px]">
      
      <div className="text-xs font-mono text-zinc-500 mb-4 flex justify-between uppercase tracking-widest border-b border-white/10 pb-2">
         <span className="group-hover:text-neon-acid transition-colors">0{index + 1} // {project.niche}</span>
         <span>{project.year}</span>
      </div>

      <a 
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative aspect-[16/10] bg-zinc-900 border border-white/10 overflow-hidden transition-all duration-700 transform group-hover:scale-[1.01] shadow-xl mb-8"
      >
        <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-900 z-30 flex items-center px-4 gap-2 border-b border-white/5">
           <div className="flex gap-1.5">
             <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
             <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
             <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
           </div>
           <div className="flex-1 text-[9px] font-mono text-zinc-500 text-center truncate px-4 bg-zinc-800/50 rounded-sm py-0.5 mx-2 shadow-sm border border-white/5">
             {project.url}
           </div>
        </div>

        {/* --- MOBILE OPTIMIZATION: Render static image instead of heavy iframe --- */}
        {isMobile ? (
             <div className="w-full h-full pt-8 relative">
                 <OptimizedImage 
                    src={project.image || `https://picsum.photos/seed/${project.id}/800/600`} 
                    alt={project.title}
                    className="w-full h-full opacity-70"
                    priority={true}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                 <div className="absolute bottom-4 left-4 right-4 text-center">
                    <span className="font-mono text-[10px] text-neon-acid border border-neon-acid/50 px-2 py-1 rounded-full bg-black/80 backdrop-blur-sm">
                        TAP TO VIEW
                    </span>
                 </div>
             </div>
        ) : (
            <>
                {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10 pt-8">
                    <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-neon-acid" size={32} />
                    <span className="text-[10px] font-mono text-zinc-500 animate-pulse">LOADING PREVIEW...</span>
                    </div>
                </div>
                )}
                
                <div className={`w-full h-full overflow-hidden transition-all duration-700 bg-zinc-900 ${isHovered ? 'blur-[2px] opacity-90' : 'blur-0 opacity-100'}`}>
                    <iframe 
                    src={project.url}
                    title={project.title}
                    className="absolute top-8 left-0 w-[200%] h-[200%] border-0 origin-top-left pointer-events-none select-none bg-white"
                    style={{ transform: 'scale(0.5)' }}
                    onLoad={() => setIsLoading(false)}
                    scrolling="no"
                    tabIndex={-1}
                    loading="lazy"
                    />
                </div>
            </>
        )}
        
        <div className={`absolute inset-0 bg-black/60 z-40 flex items-center justify-center backdrop-blur-sm transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
           <div className="w-24 h-24 rounded-full border border-neon-acid/50 bg-black flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 hover:bg-neon-acid hover:text-black text-white">
              <ArrowUpRight className="w-8 h-8 transition-colors" />
           </div>
        </div>
      </a>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/10 pt-6">
          <div>
              <h3 className="text-3xl font-serif text-white group-hover:text-neon-acid transition-colors duration-500 leading-none mb-2">
                {project.title}
              </h3>
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{project.category}</p>
          </div>
          <div className="space-y-2 text-sm">
             <div className="flex gap-2">
                 <span className="text-zinc-500 font-mono uppercase">{t.portfolio.task}:</span>
                 <span className="text-zinc-300">{project.task}</span>
             </div>
             <div className="flex gap-2">
                 <span className="text-neon-acid font-mono uppercase font-bold">{t.portfolio.result}:</span>
                 <span className="text-white font-bold">{project.result}</span>
             </div>
          </div>
      </div>
    </div>
  );
};
