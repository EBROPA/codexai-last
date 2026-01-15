import React, { useState } from 'react';
import { generateSiteConcept } from '../services/geminiService';
import { ConceptResponse } from '../types';
import { Loader2, Sparkles, Terminal } from 'lucide-react';

export const AICreator: React.FC = () => {
  const [idea, setIdea] = useState('');
  const [concept, setConcept] = useState<ConceptResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setLoading(true);
    const result = await generateSiteConcept(idea);
    setConcept(result);
    setLoading(false);
  };

  return (
    <section className="py-24 px-4 md:px-12 border-b border-white/10 relative overflow-hidden flex items-center justify-center bg-black">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-acid/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-neon-purple/50 bg-neon-purple/10 text-neon-purple text-xs font-mono mb-6 uppercase tracking-wider animate-pulse-slow">
            <Sparkles size={12} />
            AI Creative Director
          </div>
          <h2 className="text-4xl md:text-7xl font-serif font-bold mb-6 text-white">ПРИДУМАЙ.<br/>МЫ ПОСТРОИМ.</h2>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-sans">
            Не знаете с чего начать? Расскажите нашему ИИ вашу бизнес-идею, и получите готовый цифровой концепт сайта мгновенно.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          
          {/* Input Area */}
          <div className="bg-zinc-900/50 border border-white/10 p-8 backdrop-blur-sm flex flex-col justify-between group hover:border-white/30 transition-colors duration-500">
            <div>
              <label className="block text-xs font-mono text-zinc-500 uppercase tracking-widest mb-4">Входной Сигнал</label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Например: Магазин элитных пончиков в стиле киберпанк, где можно платить криптой..."
                className="w-full bg-transparent border-none text-xl md:text-2xl text-white placeholder-zinc-700 focus:ring-0 resize-none h-40 interactive outline-none font-serif leading-tight"
              />
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading || !idea}
                className="interactive relative px-8 py-4 bg-white text-black font-bold font-mono text-sm uppercase tracking-wider hover:bg-neon-acid transition-colors disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group/btn w-full md:w-auto"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={16} /> ОБРАБОТКА
                  </span>
                ) : (
                  <span className="relative z-10">СГЕНЕРИРОВАТЬ КОНЦЕПТ</span>
                )}
                <div className="absolute inset-0 bg-neon-acid transform scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left duration-300 -z-0"></div>
              </button>
            </div>
          </div>

          {/* Output Area */}
          <div className={`bg-zinc-950 border border-white/10 p-8 font-mono text-sm relative min-h-[400px] flex flex-col ${concept ? 'justify-start' : 'justify-center items-center'}`}>
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-acid opacity-30"></div>
             
             {!concept && !loading && (
               <div className="text-zinc-700 text-center">
                 <Terminal size={48} className="mx-auto mb-4 opacity-50" />
                 <p className="uppercase tracking-widest text-xs">Ожидание данных...</p>
               </div>
             )}

             {loading && (
                <div className="flex flex-col items-center justify-center h-full text-neon-acid">
                  <div className="font-mono text-xs mb-2 blink">ACCESSING NEURAL NET</div>
                  <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-neon-acid animate-float origin-left"></div>
                  </div>
                </div>
             )}

             {concept && !loading && (
               <div className="animate-pulse-slow space-y-8">
                 <div className="border-b border-white/10 pb-4">
                   <span className="text-zinc-500 text-[10px] uppercase block mb-2">Кодовое Имя</span>
                   <h3 className="text-2xl md:text-3xl text-white font-bold font-serif italic">"{concept.tagline}"</h3>
                 </div>
                 
                 <div>
                   <span className="text-zinc-500 text-[10px] uppercase block mb-2">Визуальный Стиль</span>
                   <p className="text-neon-purple leading-relaxed text-base">
                     {concept.visualDirection}
                   </p>
                 </div>

                 <div>
                   <span className="text-zinc-500 text-[10px] uppercase block mb-2">Ключевые Фичи</span>
                   <ul className="space-y-3">
                     {concept.features.map((feature, idx) => (
                       <li key={idx} className="flex items-start gap-3 text-zinc-300">
                        <span className="text-neon-acid mt-1">{">>"}</span>
                         {feature}
                       </li>
                     ))}
                   </ul>
                 </div>
                 
                 <div className="pt-4 mt-auto">
                    <p className="text-[10px] text-zinc-600">
                      // Концепт сгенерирован специально для вас. <br/>
                      // Свяжитесь с нами для реализации.
                    </p>
                 </div>
               </div>
             )}
          </div>

        </div>
      </div>
    </section>
  );
};
