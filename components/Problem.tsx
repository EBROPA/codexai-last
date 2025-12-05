import React, { useState } from 'react';
import { EyeOff, Zap } from 'lucide-react';

export const Problem: React.FC = () => {
  const [activeSide, setActiveSide] = useState<'boring' | 'codexai'>('codexai');

  return (
    <section className="py-32 bg-zinc-950 relative overflow-hidden border-b border-white/10">
      <div className="px-4 md:px-12 max-w-[90rem] mx-auto">
        
        <div className="mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 uppercase">
            Почему 90% сайтов <br/> <span className="text-zinc-600 line-through decoration-neon-acid decoration-4">не работают?</span>
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto font-mono text-sm md:text-base leading-relaxed">
            Интернет переполнен шаблонами. Если ваш сайт выглядит как у всех, ваш бизнес воспринимают как "очередной". Внимания пользователя хватает на 3 секунды.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border border-white/10 min-h-[500px]">
          
          {/* Boring Side */}
          <div 
            onMouseEnter={() => setActiveSide('boring')}
            className={`
              relative p-12 flex flex-col justify-center transition-all duration-700 ease-in-out cursor-crosshair
              ${activeSide === 'boring' ? 'flex-[1.5] bg-zinc-900 opacity-100 grayscale-0' : 'flex-[1] bg-black opacity-40 grayscale'}
            `}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-10"></div>
            
            <div className={`transition-all duration-500 ${activeSide === 'boring' ? 'scale-100 blur-0' : 'scale-90 blur-[2px]'}`}>
              <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-8 text-zinc-500">
                <EyeOff size={32} />
              </div>
              <h3 className="text-3xl font-serif text-zinc-300 mb-4">Обычный Веб</h3>
              <ul className="space-y-4 font-mono text-sm text-zinc-500">
                <li className="flex items-center gap-2"><span className="text-red-900">✕</span> Шаблонный дизайн</li>
                <li className="flex items-center gap-2"><span className="text-red-900">✕</span> Сливается с конкурентами</li>
                <li className="flex items-center gap-2"><span className="text-red-900">✕</span> Низкая конверсия</li>
                <li className="flex items-center gap-2"><span className="text-red-900">✕</span> "Мертвый" контент</li>
              </ul>
            </div>
          </div>

          {/* CodexAI Side */}
          <div 
            onMouseEnter={() => setActiveSide('codexai')}
            className={`
              relative p-12 flex flex-col justify-center overflow-hidden transition-all duration-700 ease-in-out cursor-default
              ${activeSide === 'codexai' ? 'flex-[1.5] bg-void border-l border-neon-acid' : 'flex-[1] bg-void border-l border-white/10'}
            `}
          >
            {/* Background Animation */}
            <div className={`absolute inset-0 bg-neon-acid/5 transition-opacity duration-500 ${activeSide === 'codexai' ? 'opacity-100' : 'opacity-0'}`}></div>
            <div className={`absolute -right-20 -top-20 w-96 h-96 bg-neon-acid/20 blur-[100px] rounded-full transition-all duration-700 ${activeSide === 'codexai' ? 'scale-100' : 'scale-50 opacity-0'}`}></div>

            <div className={`relative z-10 transition-all duration-500 ${activeSide === 'codexai' ? 'scale-100 opacity-100' : 'scale-90 opacity-50'}`}>
              <div className="w-16 h-16 border border-neon-acid rounded-full flex items-center justify-center mb-8 text-neon-acid shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                <Zap size={32} className={activeSide === 'codexai' ? 'fill-neon-acid' : ''} />
              </div>
              <h3 className="text-4xl font-serif text-white mb-4 italic">
                Метод <span className="text-neon-acid">CODEXAI</span>
              </h3>
              <ul className="space-y-4 font-mono text-sm text-white">
                <li className="flex items-center gap-2">
                  <span className="text-neon-acid">>>></span> 
                  <span className="bg-neon-acid/10 px-1">Эмоциональный захват</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neon-acid">>>></span> 
                  Визуальная доминация
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neon-acid">>>></span> 
                  Сценарий продаж
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-neon-acid">>>></span> 
                  Технологическое превосходство
                </li>
              </ul>

              <div className={`mt-8 overflow-hidden transition-all duration-500 ${activeSide === 'codexai' ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest border-t border-white/10 pt-4">
                  Мы превращаем посетителей в фанатов бренда.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};