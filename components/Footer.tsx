
import React from 'react';
import { Instagram, Send, Mail, ArrowUpRight } from 'lucide-react';
import { useRouter } from '../lib/router';
import { useLanguage } from '../lib/i18n';

interface FooterProps {
  // No props needed now
}

export const Footer: React.FC<FooterProps> = () => {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <footer className="bg-black pt-24 pb-12 relative overflow-hidden">
      <div className="px-4 md:px-12 max-w-[90rem] mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8 mb-20">
          
          <div className="md:col-span-1">
             <div className="font-serif font-bold text-3xl text-white mb-6">CODEXAI.</div>
             <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest leading-relaxed max-w-xs">
               {t.footer.desc}
             </p>
          </div>

          <div>
             <h4 className="font-mono text-white text-xs uppercase tracking-widest mb-8">{t.footer.nav}</h4>
             <ul className="space-y-4 font-sans text-zinc-400">
                <li><button onClick={() => router.push('/')} className="hover:text-neon-acid transition-colors">{t.nav.home}</button></li>
                <li><button onClick={() => router.push('/work')} className="hover:text-neon-acid transition-colors">{t.nav.work}</button></li>
                <li><button onClick={() => router.push('/services')} className="hover:text-neon-acid transition-colors">{t.nav.services}</button></li>
                <li><button onClick={() => router.push('/contact')} className="hover:text-neon-acid transition-colors">{t.nav.contact}</button></li>
             </ul>
          </div>

          <div>
             <h4 className="font-mono text-white text-xs uppercase tracking-widest mb-8">{t.footer.socials}</h4>
             <ul className="space-y-4 font-sans text-zinc-400">
                <li><a href="https://t.me/codexai_pro" target="_blank" rel="noopener noreferrer" className="hover:text-neon-acid transition-colors flex items-center gap-2">Telegram <ArrowUpRight size={14}/></a></li>
                <li><a href="https://wa.me/74950322199" target="_blank" rel="noopener noreferrer" className="hover:text-neon-acid transition-colors flex items-center gap-2">WhatsApp <ArrowUpRight size={14}/></a></li>
                <li><a href="#" className="hover:text-neon-acid transition-colors flex items-center gap-2">Instagram <ArrowUpRight size={14}/></a></li>
             </ul>
          </div>

          <div>
             <h4 className="font-mono text-white text-xs uppercase tracking-widest mb-8">{t.footer.contacts}</h4>
             <ul className="space-y-4">
                <li className="flex items-center gap-2">
                   <Mail size={16} className="text-neon-acid"/>
                   <a href="mailto:contact@codexai.pro" className="text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors">
                      contact@codexai.pro
                   </a>
                </li>
                <li className="flex items-center gap-2">
                   <Send size={16} className="text-neon-acid"/>
                   <a href="https://t.me/codexai_team" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors">
                      @codexai_team
                   </a>
                </li>
             </ul>
             <button 
                onClick={() => router.push('/contact')}
                className="mt-8 px-6 py-3 border border-white/20 text-white font-mono text-xs uppercase tracking-widest hover:bg-neon-acid hover:text-black hover:border-neon-acid transition-all duration-300"
             >
                {t.footer.cta}
             </button>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
              {t.footer.rights}
           </div>
           <div className="flex gap-8 text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">{t.footer.privacy}</a>
              <a href="#" className="hover:text-white transition-colors">{t.footer.terms}</a>
           </div>
        </div>
      </div>
    </footer>
  );
};
