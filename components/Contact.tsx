
import React, { useState } from 'react';
import { Send, MapPin, ArrowUpRight, Check } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="min-h-screen pt-32 pb-12 px-4 md:px-12 relative overflow-hidden bg-void text-white border-t border-white/10 flex flex-col justify-between">
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-purple/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-acid/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

      <div className="max-w-[100rem] w-full mx-auto relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-24">
        
        <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
                <div className="inline-flex items-center gap-3 mb-12 px-4 py-2 border border-neon-acid/30 rounded-full bg-neon-acid/5 backdrop-blur-sm">
                    <div className="w-2 h-2 bg-neon-acid rounded-full animate-pulse shadow-[0_0_10px_#ccff00]"></div>
                    <span className="font-mono text-xs text-neon-acid uppercase tracking-widest">{t.contact.badge}</span>
                </div>
                
                <h2 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] tracking-tighter mb-8">
                    {t.contact.title} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-white to-zinc-500 animate-pulse-slow">{t.contact.titleHighlight}</span>
                </h2>

                <p className="text-zinc-400 font-mono text-sm md:text-base max-w-lg leading-relaxed uppercase tracking-wide mb-16">
                   {t.contact.desc}
                </p>
            </div>

            <div className="flex gap-4 mb-12 lg:mb-0">
               <a 
                  href="https://t.me/codexai_pro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase tracking-widest inline-flex items-center"
               >
                  Telegram
               </a>
               <a 
                  href="https://wa.me/74950322199"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase tracking-widest inline-flex items-center"
               >
                  WhatsApp
               </a>
               <a 
                  href="mailto:contact@codexai.pro"
                  className="px-6 py-3 border border-white/20 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase tracking-widest inline-flex items-center"
               >
                  Email
               </a>
            </div>
        </div>

        <div className="lg:col-span-5 bg-black border border-white/20 p-1 relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-acid/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
             
             <div className="bg-zinc-950 h-full p-8 md:p-10 relative z-10 flex flex-col gap-8">
                 <div className="font-mono text-[10px] text-zinc-600 uppercase tracking-widest flex justify-between">
                    <span>{t.contact.form.quickBrief}</span>
                    <span>ID: #9284-AX</span>
                 </div>

                 <form className="space-y-8 flex-1" onSubmit={handleSubmit}>
                    <div className="group/input">
                       <label className="block font-mono text-[10px] text-neon-purple mb-2 opacity-0 group-focus-within/input:opacity-100 transition-opacity uppercase">{t.contact.form.name}</label>
                       <input 
                         type="text" 
                         placeholder={t.contact.form.namePlaceholder}
                         className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-600 focus:outline-none focus:border-neon-purple transition-colors"
                       />
                    </div>
                    <div className="group/input">
                       <label className="block font-mono text-[10px] text-neon-purple mb-2 opacity-0 group-focus-within/input:opacity-100 transition-opacity uppercase">{t.contact.form.niche}</label>
                       <input 
                         type="text" 
                         placeholder={t.contact.form.nichePlaceholder}
                         className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-600 focus:outline-none focus:border-neon-purple transition-colors"
                       />
                    </div>
                    <div className="group/input">
                       <label className="block font-mono text-[10px] text-neon-purple mb-2 opacity-0 group-focus-within/input:opacity-100 transition-opacity uppercase">{t.contact.form.contact}</label>
                       <input 
                         type="text" 
                         placeholder={t.contact.form.contactPlaceholder}
                         className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-600 focus:outline-none focus:border-neon-purple transition-colors"
                       />
                    </div>
                    <div className="group/input">
                       <label className="block font-mono text-[10px] text-neon-purple mb-2 opacity-0 group-focus-within/input:opacity-100 transition-opacity uppercase">{t.contact.form.comment}</label>
                       <textarea 
                         rows={2}
                         placeholder={t.contact.form.commentPlaceholder}
                         className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-600 focus:outline-none focus:border-neon-purple transition-colors resize-none"
                       />
                    </div>

                    <button 
                        disabled={isSubmitted}
                        className={`w-full mt-8 font-bold font-mono text-sm uppercase py-5 tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-4 group/btn relative overflow-hidden ${isSubmitted ? 'bg-neon-acid text-black cursor-default' : 'bg-white text-black hover:bg-neon-acid'}`}
                    >
                        {isSubmitted ? (
                            <span className="relative z-10 flex items-center gap-2 animate-pulse">
                                <Check size={18} /> {t.contact.form.success}
                            </span>
                        ) : (
                            <>
                                <span className="relative z-10">{t.contact.form.submit}</span>
                                <Send size={16} className="relative z-10 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                <div className="absolute inset-0 bg-neon-acid transform translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 z-0"></div>
                            </>
                        )}
                    </button>
                 </form>
             </div>
        </div>

      </div>

      <div className="max-w-[100rem] mx-auto w-full mt-24 border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-end gap-6 relative z-10">
          <div className="flex flex-col gap-1">
             <span className="text-3xl font-serif font-bold text-white">CODEXAI<span className="text-neon-acid">.</span></span>
             <span className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">{t.footer.rights}</span>
          </div>
          
          <div className="flex flex-wrap gap-8 md:gap-12">
             <a href="mailto:hello@codexai.agency" className="text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors">hello@codexai.agency</a>
          </div>
      </div>
    </section>
  );
};
