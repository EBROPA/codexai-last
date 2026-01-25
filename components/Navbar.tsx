
import React, { useState } from 'react';
import { Menu, X, Instagram, Send, Mail, ChevronRight, ChevronDown, Phone, Globe, Bot, Brain, Layout, MessageCircle, BarChart, Users } from 'lucide-react';
import { usePathname, useRouter } from '../lib/router';
import { useLanguage } from '../lib/i18n';
import { OptimizedImage } from './Image';
import glav_menu from '../img/glav_menu_optimized.jpg'
import portfolio_menu from '../img/portfolio_menu_optimized.jpg'
import contact_menu from '../img/contac_menu_optimized.jpg'

export const Navbar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { lang, toggleLang, t } = useLanguage();

    const [isOpen, setIsOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

    // Safety check to ensure t exists
    if (!t) return null;

    const handleNav = (href: string) => {
        router.push(href);
        setIsOpen(false);
        setIsMobileServicesOpen(false);
    };

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    const isActive = (path: string) => {
        if (path === '/') return pathname === '/';
        return pathname.startsWith(path);
    };

    // Dynamic Menu Items based on Lang
    const menuItems = [
        {
            id: '/',
            label: t.nav.home,
            sub: '01',
            desc: t.nav.desc.home,
            image: glav_menu
        },
        {
            id: '/about',
            label: t.nav.about,
            sub: '02',
            desc: t.nav.desc.about,
            image: glav_menu
        },
        {
            id: '/work',
            label: t.nav.work,
            sub: '03',
            desc: t.nav.desc.work,
            image: portfolio_menu
        },
        {
            id: '/services',
            label: t.nav.services,
            sub: '04',
            desc: t.nav.desc.services,
            image: '/img/codexai-logo.png',
            subItems: [
                { id: '/services/web', label: t.services.items.web.title },
                { id: '/services/bots', label: t.services.items.bots.title },
                { id: '/services/ai', label: t.services.items.ai.title },
                { id: '/services/complex', label: t.services.items.complex.title },
                { id: '/services/tma', label: t.services.items.tma.title },
                { id: '/services/reputation', label: t.services.items.reputation.title },
                { id: '/services/custom', label: t.services.items.custom.title },
                { id: '/services/direct', label: t.services.items.direct.title },
                { id: '/services/tgads', label: t.services.items.tgads.title },
            ]
        },
        {
            id: '/blog',
            label: t.nav.blog || 'Блог',
            sub: '05',
            desc: t.nav.desc?.blog || 'Статьи и кейсы',
            image: glav_menu
        },
        {
            id: '/contact',
            label: t.nav.contact,
            sub: '06',
            desc: t.nav.desc.contact,
            image: contact_menu
        }
    ];

    return (
        <>
            {/* Top Bar */}
            {/* Top Bar */}
            {/* Top Bar */}
            <nav className={`fixed top-0 left-0 w-full z-[80] px-6 py-6 flex justify-between items-center text-white transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <button
                    onClick={() => handleNav('/')}
                    className="font-serif font-bold text-2xl tracking-tighter pointer-events-auto cursor-pointer interactive group flex flex-col items-start bg-transparent border-none p-0 text-left"
                >
                    <span className="text-white">CODEX<span className="text-neon-acid">AI.</span></span>
                    <span className="text-[10px] font-mono font-normal opacity-0 group-hover:opacity-100 transition-opacity text-neon-acid tracking-widest">DIGITAL AGENCY</span>
                </button>

                {/* Desktop Navigation (Center) */}
                <div className="hidden md:flex items-center gap-2 pointer-events-auto bg-black/60 backdrop-blur-md pl-6 pr-2 py-2 rounded-full border border-white/10 shadow-lg">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className="relative group p-1"
                            onMouseEnter={() => item.id === '/services' && setHoveredItem('/services')}
                            onMouseLeave={() => item.id === '/services' && setHoveredItem(null)}
                        >
                            <button
                                onClick={() => handleNav(item.id)}
                                className={`
                                    relative px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all duration-300 rounded-full
                                    flex items-center gap-2 overflow-hidden
                                    ${isActive(item.id) ? 'bg-neon-acid text-black font-bold' : 'text-zinc-300 hover:text-white hover:bg-white/10'}
                                `}
                            >
                                {item.label}
                                {item.id === '/services' && (
                                    <ChevronDown
                                        size={12}
                                        className={`transition-transform duration-300 ${hoveredItem === '/services' ? 'rotate-180 text-black' : 'text-zinc-500'}`}
                                    />
                                )}
                            </button>

                            {/* Dropdown for Services */}
                            {item.id === '/services' && (
                                <div className={`absolute top-full left-0 pt-4 w-[600px] transition-all duration-300 transform origin-top-left ${hoveredItem === '/services' ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
                                    <div className="bg-white rounded-2xl p-2 shadow-2xl grid grid-cols-2 gap-1 border border-zinc-200/50 ring-4 ring-black/5">
                                        {item.subItems?.map((sub, idx) => {
                                            // Assign icons dynamically based on index or ID
                                            const icons = [Globe, Bot, Brain, Layout, MessageCircle, Users, Layout, Send, BarChart];
                                            const Icon = icons[idx % icons.length];

                                            return (
                                                <button
                                                    key={sub.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setHoveredItem(null); // Close dropdown on click
                                                        handleNav(sub.id);
                                                    }}
                                                    className="group/item flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 transition-all duration-200 text-left"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-[#F2FFCC] flex items-center justify-center text-[#668000] group-hover/item:bg-[#CCFF00] group-hover/item:text-black transition-colors duration-300">
                                                        <Icon size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-zinc-900 text-xs uppercase tracking-wider group-hover/item:text-black transition-colors">
                                                            {sub.label}
                                                        </div>
                                                        <div className="text-[10px] text-zinc-400 font-mono mt-1">
                                                            Explore service →
                                                        </div>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Desktop Language Switcher - Integrated into Nav Pill */}
                    <div className="w-[1px] h-6 bg-white/10 mx-2"></div>
                    <button
                        onClick={toggleLang}
                        className="font-mono text-xs px-3 py-2 rounded-full hover:bg-white/10 transition-colors text-white flex items-center gap-2"
                    >
                        <span className={lang === 'ru' ? 'text-[#CCFF00] font-bold' : 'text-zinc-500'}>RU</span>
                        <span className="text-zinc-700">/</span>
                        <span className={lang === 'en' ? 'text-[#CCFF00] font-bold' : 'text-zinc-500'}>EN</span>
                    </button>
                </div>

                {/* Right Controls */}
                <div className="pointer-events-auto flex items-center gap-4">

                    {/* Phone Number (Desktop) */}
                    <a
                        href="tel:+79167479970"
                        className="hidden lg:flex items-center gap-2 font-mono text-xs text-white hover:text-[#CCFF00] transition-colors"
                    >
                        <Phone size={14} className="text-[#CCFF00]" />
                        <span>+7 916 747-99-70</span>
                    </a>

                    {/* Mobile Burger (Hidden on desktop) */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        className="md:hidden flex items-center gap-2 uppercase font-mono text-xs tracking-widest hover:text-neon-acid transition-colors interactive group relative text-white"
                    >
                        <div className={`
                            relative w-10 h-10 flex items-center justify-center border rounded-full transition-all duration-300 backdrop-blur-sm
                            ${isOpen ? 'border-neon-acid bg-neon-acid/10 text-neon-acid' : 'border-white/20 bg-black/50 text-white group-hover:border-neon-acid'}
                        `}>
                            {isOpen ? <X size={16} /> : <Menu size={16} />}
                        </div>
                    </button>

                    {/* Contact Button Desktop */}
                    <button
                        onClick={() => {
                            window.location.href = '/contact#request-form';
                            setIsOpen(false);
                        }}
                        className="hidden md:flex px-6 py-3 bg-white text-black font-bold font-mono text-xs uppercase tracking-widest hover:bg-[#CCFF00] transition-colors rounded-full items-center gap-2"
                    >
                        <span>{lang === 'ru' ? 'Оставить заявку' : 'Leave a Request'}</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
            </nav>

            {/* Fullscreen Overlay */}
            <div className={`fixed inset-0 z-[70] bg-black transition-all duration-700 ease-[0.76, 0, 0.24, 1] md:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>

                <div className="h-full w-full flex flex-col md:flex-row">

                    {/* Left Column: Navigation */}
                    <div className="w-full md:w-[60%] h-full flex flex-col justify-between px-6 md:px-24 py-24 md:py-12 relative z-10 border-r border-white/5 bg-black overflow-y-auto md:overflow-hidden">

                        {/* Language Switcher (Visible inside menu) */}
                        <div className="w-full flex justify-end md:absolute md:top-12 md:right-12 z-20 mb-6 md:mb-0">
                            <button
                                onClick={toggleLang}
                                className="font-mono text-xs border border-white/20 px-4 py-2 rounded-full hover:border-neon-acid transition-colors bg-black text-white"
                            >
                                <span className={lang === 'ru' ? 'text-neon-acid' : 'text-zinc-500'}>RU</span>
                                <span className="mx-2 text-zinc-700">/</span>
                                <span className={lang === 'en' ? 'text-neon-acid' : 'text-zinc-500'}>EN</span>
                            </button>
                        </div>

                        <div className="flex flex-col justify-center flex-1 gap-2 min-h-min md:mt-0">
                            {menuItems.map((item, idx) => (
                                <React.Fragment key={item.id}>
                                    <button
                                        onClick={() => {
                                            if (item.id === '/services') {
                                                setIsMobileServicesOpen(!isMobileServicesOpen);
                                                return;
                                            }
                                            handleNav(item.id)
                                        }}
                                        onMouseEnter={() => setHoveredItem(item.id)}
                                        className={`
                                relative text-left font-serif font-bold tracking-tighter select-none py-4
                                transition-all duration-500 interactive group flex items-baseline gap-6
                                ${isActive(item.id) ? 'text-neon-acid' : 'text-white'}
                                ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
                            `}
                                        style={{ transitionDelay: `${idx * 100}ms` }}
                                    >
                                        <span className="font-mono text-xs text-zinc-600 group-hover:text-neon-acid transition-colors">/{item.sub}</span>
                                        <span className="text-5xl md:text-8xl group-hover:translate-x-4 transition-transform duration-500 ease-out flex items-center gap-4">
                                            {item.label}
                                            {item.id === '/services' && (
                                                <ChevronDown
                                                    size={24}
                                                    className={`md:hidden transition-transform duration-300 ${isMobileServicesOpen ? 'rotate-180 text-neon-acid' : 'text-zinc-600'}`}
                                                />
                                            )}
                                        </span>

                                        {/* Hover Reveal Description (Desktop) */}
                                        {hoveredItem !== '/services' && (
                                            <div className="hidden md:block absolute left-full top-1/2 -translate-y-1/2 ml-8 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0 whitespace-nowrap">
                                                <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest border-l border-neon-acid pl-3">
                                                    {item.desc}
                                                </span>
                                            </div>
                                        )}
                                    </button>

                                    {/* Mobile Submenu (Dropdown) */}
                                    {item.id === '/services' && (
                                        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileServicesOpen ? 'max-h-[800px] opacity-100 mb-8' : 'max-h-0 opacity-0'}`}>
                                            <div className="flex flex-col gap-4 pl-14 border-l border-white/10 ml-2">
                                                {item.subItems?.map((sub) => (
                                                    <button
                                                        key={sub.id}
                                                        onClick={() => handleNav(sub.id)}
                                                        className="text-left font-serif text-lg text-zinc-400 hover:text-white transition-colors py-1"
                                                    >
                                                        {sub.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        <div className={`flex flex-col gap-4 transition-all duration-700 delay-300 mt-8 md:mt-0 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="h-[1px] w-full bg-white/10 mb-4"></div>
                            <div className="flex flex-wrap gap-8 text-zinc-400 font-mono text-xs uppercase tracking-widest">
                                <a href="tel:+79167479970" className="hover:text-white flex items-center gap-2"><Phone size={12} /> +7 916 747-99-70</a>
                                <a href="#" className="hover:text-white flex items-center gap-2"><Send size={12} /> Telegram</a>
                                <a href="#" className="hover:text-white flex items-center gap-2"><Instagram size={12} /> Instagram</a>
                                <a href="mailto:contact@codexai.pro" className="hover:text-white flex items-center gap-2"><Mail size={12} /> contact@codexai.pro</a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visual Preview OR Sub-menu (Desktop Only) */}
                    <div className="hidden md:block w-[40%] h-full relative overflow-hidden bg-zinc-950">

                        {/* Default Image Previews */}
                        {menuItems.map((item) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out pointer-events-none 
                        ${hoveredItem === item.id && item.id !== '/services' ? 'opacity-60 scale-105' : 'opacity-0 scale-100'}`}
                            >
                                <OptimizedImage
                                    src={item.image}
                                    alt={item.label}
                                    className="w-full h-full opacity-60 grayscale transition-all duration-700 ease-in-out"
                                    priority={true}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                            </div>
                        ))}

                        {/* Special Sub-menu for SERVICES */}
                        <div
                            className={`absolute inset-0 bg-black flex flex-col justify-center px-16 transition-all duration-500 
                    ${hoveredItem === '/services' ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}
                        >
                            <div className="font-mono text-neon-acid text-xs uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
                        // {t.nav.services}
                            </div>
                            <div className="flex flex-col gap-4">
                                {menuItems.find(i => i.id === '/services')?.subItems?.map((sub) => (
                                    <button
                                        key={sub.id}
                                        onClick={() => handleNav(sub.id)}
                                        className="text-left font-serif text-2xl text-zinc-400 hover:text-white hover:pl-4 transition-all duration-300 flex items-center justify-between group/sub"
                                    >
                                        <span>{sub.label}</span>
                                        <ChevronRight size={16} className="opacity-0 group-hover/sub:opacity-100 text-neon-acid transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Idle State */}
                        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ${hoveredItem ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="text-center opacity-20">
                                <div className="text-[200px] leading-none font-serif font-bold text-white blur-sm select-none">C</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};
