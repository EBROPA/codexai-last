import React, { useEffect } from 'react';
import { ArrowRight, Linkedin, Send, Award, Briefcase, GraduationCap } from 'lucide-react';
import { useRouter } from '../lib/router';
import { SEO } from './SEO';
import { Breadcrumbs } from './Breadcrumbs';

// Author interface for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
interface Author {
  id: string;
  name: string;
  role: string;
  roleEn: string;
  bio: string;
  bioEn: string;
  experience: string[];
  experienceEn: string[];
  expertise: string[];
  social: { platform: string; url: string; icon: React.ReactNode }[];
  photo: string;
  yearsExperience: number;
  projectsCount: number;
}

// Team data for E-E-A-T signals
const AUTHORS: Author[] = [
  {
    id: 'founder',
    name: 'CODEXAI Team',
    role: 'Основатель и CEO',
    roleEn: 'Founder & CEO',
    bio: 'Основатель веб-студии CODEXAI. Более 7 лет опыта в digital-разработке. Специализация: стратегия цифровых продуктов, UX/UI дизайн, высоконагруженные системы. Работал с компаниями из сфер недвижимости, финтеха и e-commerce.',
    bioEn: 'Founder of CODEXAI web studio. 7+ years of experience in digital development. Specialization: digital product strategy, UX/UI design, high-load systems. Worked with companies in real estate, fintech and e-commerce.',
    experience: [
      '50+ успешных проектов',
      'Рост конверсии клиентов до +340%',
      'Работа с бюджетами от 100K до 5M руб',
      'Сертификация Google Analytics',
      'Сертификация Яндекс.Директ'
    ],
    experienceEn: [
      '50+ successful projects',
      'Client conversion growth up to +340%',
      'Projects from $1K to $50K',
      'Google Analytics certified',
      'Yandex.Direct certified'
    ],
    expertise: ['React', 'Next.js', 'TypeScript', 'Node.js', 'AI/ML', 'UX Research'],
    social: [
      { platform: 'Telegram', url: 'https://t.me/codexai_pro', icon: <Send size={18} /> },
      { platform: 'LinkedIn', url: 'https://linkedin.com/company/codexai', icon: <Linkedin size={18} /> }
    ],
    photo: '/img/codexai-logo.png',
    yearsExperience: 7,
    projectsCount: 50
  }
];

// Generate Person schema for SEO
const generateAuthorSchema = (author: Author, lang: 'ru' | 'en') => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `https://codexai.pro/team/${author.id}`,
  name: author.name,
  jobTitle: lang === 'ru' ? author.role : author.roleEn,
  description: lang === 'ru' ? author.bio : author.bioEn,
  image: `https://codexai.pro${author.photo}`,
  sameAs: author.social.map(s => s.url),
  worksFor: {
    '@type': 'Organization',
    '@id': 'https://codexai.pro/#organization',
    name: 'CODEXAI'
  },
  knowsAbout: author.expertise,
  alumniOf: {
    '@type': 'Organization',
    name: 'CODEXAI Digital Agency'
  }
});

interface AuthorPageProps {
  authorId?: string;
  lang?: 'ru' | 'en';
}

export const AuthorPage: React.FC<AuthorPageProps> = ({ authorId = 'founder', lang = 'ru' }) => {
  const router = useRouter();
  const author = AUTHORS.find(a => a.id === authorId) || AUTHORS[0];
  const isRu = lang === 'ru';

  const breadcrumbs = [
    { name: isRu ? 'Главная' : 'Home', url: '/' },
    { name: isRu ? 'О компании' : 'About', url: '/about' },
    { name: isRu ? 'Команда' : 'Team', url: '/about#team' },
    { name: author.name, url: `/team/${author.id}` }
  ];

  // Inject schema on mount
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-author-schema', author.id);
    const schemaLang: 'ru' | 'en' = lang === 'en' ? 'en' : 'ru';
    script.textContent = JSON.stringify(generateAuthorSchema(author, schemaLang));
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(`script[data-author-schema="${author.id}"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [author, lang]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4 md:px-12">
      <SEO
        title={`${author.name} - ${isRu ? author.role : author.roleEn} | CODEXAI`}
        description={isRu ? author.bio : author.bioEn}
        path={`/team/${author.id}`}
        lang={lang}
        breadcrumbs={breadcrumbs}
      />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} className="mb-8" />

        {/* Author Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-12 border-b border-white/10 pb-12">
          <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-neon-acid/30 flex-shrink-0">
            <img
              src={author.photo}
              alt={author.name}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
              {author.name}
            </h1>
            <p className="text-neon-acid font-mono text-sm uppercase tracking-widest mb-4">
              {isRu ? author.role : author.roleEn}
            </p>
            <p className="text-zinc-400 leading-relaxed mb-6">
              {isRu ? author.bio : author.bioEn}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {author.social.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-white/10 text-zinc-400 hover:text-neon-acid hover:border-neon-acid transition-colors flex items-center gap-2 text-sm"
                >
                  {social.icon}
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-zinc-900/50 border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-neon-acid mb-1">{author.yearsExperience}+</div>
            <div className="text-zinc-500 text-sm uppercase tracking-wide">
              {isRu ? 'Лет опыта' : 'Years Experience'}
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-white/10 p-6 text-center">
            <div className="text-3xl font-bold text-neon-acid mb-1">{author.projectsCount}+</div>
            <div className="text-zinc-500 text-sm uppercase tracking-wide">
              {isRu ? 'Проектов' : 'Projects'}
            </div>
          </div>
          <div className="bg-zinc-900/50 border border-white/10 p-6 text-center col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-neon-acid mb-1">100%</div>
            <div className="text-zinc-500 text-sm uppercase tracking-wide">
              {isRu ? 'Сроки соблюдены' : 'On-time Delivery'}
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
            <Briefcase size={24} className="text-neon-acid" />
            {isRu ? 'Опыт и достижения' : 'Experience & Achievements'}
          </h2>
          <ul className="space-y-3">
            {(isRu ? author.experience : author.experienceEn).map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-zinc-300">
                <Award size={16} className="text-neon-acid mt-1 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Expertise */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-3">
            <GraduationCap size={24} className="text-neon-acid" />
            {isRu ? 'Экспертиза' : 'Expertise'}
          </h2>
          <div className="flex flex-wrap gap-3">
            {author.expertise.map((skill, idx) => (
              <span
                key={idx}
                className="px-4 py-2 bg-zinc-900 border border-white/10 text-zinc-300 font-mono text-sm hover:border-neon-acid hover:text-neon-acid transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={() => router.push('/contact')}
            className="group px-10 py-6 bg-neon-acid text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-3"
          >
            {isRu ? 'Обсудить проект' : 'Discuss Project'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Export authors data for use in other components
export { AUTHORS };
export type { Author };

export default AuthorPage;
