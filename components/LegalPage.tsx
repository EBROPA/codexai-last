import React from 'react';
import { legalContent } from '../lib/legalContent';
import { useRouter } from '../lib/router';
import { ArrowLeft } from 'lucide-react';

interface LegalPageProps {
  type: keyof typeof legalContent;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const router = useRouter();
  const data = legalContent[type];

  if (!data) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.push('/')}
          className="group flex items-center gap-2 text-zinc-500 hover:text-neon-acid transition-colors mb-12 font-mono text-sm uppercase tracking-widest"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Назад
        </button>

        <header className="mb-16 border-b border-white/10 pb-8">
          <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">{data.title}</h1>
          <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
            Последнее обновление: {data.updatedAt}
          </p>
        </header>

        <div className="space-y-12 text-zinc-300 leading-relaxed">
          {data.content.map((section, index) => (
            <section key={index}>
              <h2 className="text-xl text-white font-bold mb-4">{section.heading}</h2>
              <p className="text-zinc-400">{section.text}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
