
import React, { useState } from 'react';
import { Send, Check, Phone, Mail, FileText, MapPin } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { usePathname } from '../lib/router';

export const Contact: React.FC = () => {
  const pathname = usePathname();
  const isContactPage = pathname === '/contact';
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [budgetError, setBudgetError] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedBudget) {
      setBudgetError(true);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData.entries()),
      budget: selectedBudget
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          (e.target as HTMLFormElement).reset();
          setSelectedBudget(null);
          setBudgetError(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const budgetOptions = t.contact.form.budgetOptionsPrompt || ['до 100к', 'от 250к', 'от 500к+'];

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

        {/* SECTION 2: REQUEST FORM */}
        <div id="request-form" className="lg:col-span-12 bg-black border border-white/20 p-1 relative overflow-hidden group rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-acid/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          <div className="bg-zinc-950 h-full p-8 md:p-16 relative z-10 flex flex-col gap-12">

            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                {t.contact.title} <span className="text-neon-acid">{t.contact.titleHighlight}</span>
              </h2>
              <p className="text-zinc-400 font-mono text-sm md:text-lg leading-relaxed uppercase tracking-wide">
                {t.contact.desc}
              </p>
            </div>

            <form className="grid gap-12" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-12">
                <div className="group/input">
                  <label htmlFor="contact-name" className="block font-mono text-[10px] text-neon-purple mb-2 uppercase">{t.contact.form.name}</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder={t.contact.form.namePlaceholder}
                    className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-700 focus:outline-none focus:border-neon-purple transition-colors"
                    required
                  />
                </div>
                <div className="group/input">
                  <label htmlFor="contact-contact" className="block font-mono text-[10px] text-neon-purple mb-2 uppercase">{t.contact.form.contact}</label>
                  <input
                    id="contact-contact"
                    name="contact"
                    type="text"
                    placeholder={t.contact.form.contactPlaceholder}
                    className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-700 focus:outline-none focus:border-neon-purple transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 gap-12">
                {/* Budget Selection */}
                <div>
                  <label className={`block font-mono text-[10px] uppercase mb-4 transition-colors ${budgetError ? 'text-red-500 animate-pulse' : 'text-neon-purple'}`}>
                    {t.contact.form.budget || 'Budget'} {budgetError && '* REQUIRED'}
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {budgetOptions.map((option: string) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSelectedBudget(option);
                          setBudgetError(false);
                        }}
                        className={`
                                px-6 py-3 rounded-xl font-mono text-sm transition-all duration-300 border
                                ${selectedBudget === option
                            ? 'bg-neon-acid text-black border-neon-acid shadow-[0_0_20px_rgba(204,255,0,0.3)]'
                            : budgetError
                              ? 'bg-red-500/10 border-red-500 text-red-500 hover:bg-red-500/20'
                              : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white'}
                             `}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Niche Input (Restored) */}
                <div className="group/input mt-8 md:mt-0">
                  <label htmlFor="contact-niche" className="block font-mono text-[10px] text-neon-purple mb-2 uppercase">
                    Сайт / Ниша
                  </label>
                  <input
                    id="contact-niche"
                    name="niche"
                    type="text"
                    placeholder="САЙТ / НИША (НЕОБЯЗАТЕЛЬНО)"
                    className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-700 focus:outline-none focus:border-neon-purple transition-colors"
                  />
                </div>
              </div>

              <div className="group/input">
                <label htmlFor="contact-comment" className="block font-mono text-[10px] text-neon-purple mb-2 uppercase">{t.contact.form.comment}</label>
                <textarea
                  id="contact-comment"
                  name="comment"
                  rows={2}
                  placeholder={t.contact.form.commentPlaceholder}
                  className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-700 focus:outline-none focus:border-neon-purple transition-colors resize-none"
                />
              </div>

              <button
                disabled={isSubmitted}
                className={`w-full md:w-auto md:px-12 mt-4 font-bold font-mono text-sm uppercase py-5 tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-4 group/btn relative overflow-hidden rounded-full ${isSubmitted ? 'bg-neon-acid text-black cursor-default' : 'bg-white text-black hover:bg-neon-acid'}`}
              >
                {isSubmitted ? (
                  <span className="relative z-10 flex items-center gap-2 animate-pulse">
                    <Check size={18} /> {t.contact.form.success}
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">{t.contact.form.submit}</span>
                    <Send size={16} className="relative z-10 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

      </div>


    </section>
  );
};
