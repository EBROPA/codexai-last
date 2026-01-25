import React from 'react';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { usePathname } from '../lib/router';
import { ContactForm } from './ContactForm';

export const Contact: React.FC = () => {
  const pathname = usePathname();
  const isContactPage = pathname === '/contact';
  const { t } = useLanguage();

  return (
    <section className="min-h-screen pt-32 pb-12 px-4 md:px-12 relative overflow-hidden bg-void text-white border-t border-white/10 flex flex-col justify-between">

      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-purple/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-neon-acid/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

      <div className="max-w-[100rem] w-full mx-auto relative z-10 flex flex-col gap-24">

        {/* SECTION 1: CONTACT INFO & MAP */}
        {isContactPage && (
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
            <div className="flex flex-col gap-12">
              <div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8">
                  Available for <br /> <span className="text-neon-acid">New Projects</span>
                </h1>

                <div className="flex flex-col gap-6">
                  <a href="tel:+79167479970" className="text-2xl md:text-3xl font-mono hover:text-neon-acid transition-colors">
                    +7 916 747-99-70
                  </a>
                  <div className="flex gap-4 flex-wrap">
                    <a href="mailto:contact@codexai.pro" className="px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                      <Mail size={14} /> Email
                    </a>
                    <a href="https://t.me/codexai_pro" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                      <Send size={14} /> Telegram
                    </a>
                    <a href="https://wa.me/79167479970" target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                      <Phone size={14} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                <h3 className="font-mono text-neon-acid text-xs uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Legal Information</h3>
                <div className="space-y-4 font-mono text-sm text-zinc-400">
                  <p className="text-white font-bold">{t.contact.legal?.name || 'ИП Гусев Никита Олегович'}</p>
                  <p>{t.contact.legal?.ogrnip || 'ОГРНИП 325774600205503'}</p>
                  <p>{t.contact.legal?.inn || 'ИНН 772465913434'}</p>
                  <div className="flex items-start gap-2 mt-4 text-white">
                    <MapPin size={16} className="text-neon-acid mt-1 flex-shrink-0" />
                    <span>{t.contact.legal?.address || 'Пресненская наб. 12, Москва'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[400px] lg:h-auto w-full rounded-2xl overflow-hidden border border-white/10 relative grayscale hover:grayscale-0 transition-all duration-500">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=37.539076%2C55.747169&mode=search&ol=geo&ouri=ymapsbm1%3A%2F%2Fgeo%3Fdata%3DCgg1NjcxNDUzORJG0KDQvtGB0YHQuNGPLCDQnNC-0YHQutCy0LAsINCf0YDQtdGB0L3QtdC90YHQutCw0Y8g0L3QsNCx0LXRgNC10LbQvdCw0Y8sIDEyIgoNyUBQQBWiRlVC&z=16.63"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen={true}
                style={{ filter: 'invert(1) hue-rotate(180deg) contrast(1.2)' }}
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        )}

        {/* SECTION 2: REQUEST FORM (Reusable) */}
        <div className="lg:col-span-12">
          <ContactForm />
        </div>

      </div>

    </section>
  );
};
