
import React, { useState } from 'react';
import { Send, Check } from 'lucide-react';
import { useLanguage } from '../lib/i18n';
import { useRouter } from '../lib/router';

export const ContactForm: React.FC = () => {
    const router = useRouter();
    const { t } = useLanguage();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
    const [budgetError, setBudgetError] = useState(false);

    // Default budget options if not loaded from t
    const budgetOptions = t.contact?.form?.budgetOptionsPrompt || ['до 100к', 'от 250к', 'от 500к+'];

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
                // Seamless redirect to Thank You page
                router.push('/thank-you');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div id="request-form" className="bg-black border border-white/20 p-1 relative overflow-hidden group rounded-3xl w-full">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-acid/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="bg-zinc-950 h-full p-8 md:p-16 relative z-10 flex flex-col gap-12">

                <div className="max-w-3xl">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        {t.contact?.title || 'Discuss'} <span className="text-neon-acid">{t.contact?.titleHighlight || 'Project'}</span>
                    </h2>
                    <p className="text-zinc-400 font-mono text-sm md:text-lg leading-relaxed uppercase tracking-wide">
                        {t.contact?.desc || 'Let\'s create something amazing.'}
                    </p>
                </div>

                <form className="grid gap-12" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="group/input">
                            <label htmlFor="contact-name" className="block font-mono text-[10px] text-neon-purple mb-2 uppercase">{t.contact?.form?.name || 'Name'}</label>
                            <input
                                id="contact-name"
                                name="name"
                                type="text"
                                placeholder={t.contact?.form?.namePlaceholder}
                                className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-700 focus:outline-none focus:border-neon-purple transition-colors"
                                required
                            />
                        </div>
                        <div className="group/input">
                            <label htmlFor="contact-contact" className="block font-mono text-[10px] text-neon-purple mb-2 uppercase">{t.contact?.form?.contact || 'Contact'}</label>
                            <input
                                id="contact-contact"
                                name="contact"
                                type="text"
                                placeholder={t.contact?.form?.contactPlaceholder}
                                className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-700 focus:outline-none focus:border-neon-purple transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="md:grid md:grid-cols-2 gap-12">
                        {/* Budget Selection */}
                        <div>
                            <label className={`block font-mono text-[10px] uppercase mb-4 transition-colors ${budgetError ? 'text-red-500 animate-pulse' : 'text-neon-purple'}`}>
                                {t.contact?.form?.budget || 'Budget'} {budgetError && '* REQUIRED'}
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

                        {/* Niche Input */}
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
                        <label htmlFor="contact-comment" className="block font-mono text-[10px] text-neon-purple mb-2 uppercase">{t.contact?.form?.comment || 'Comment'}</label>
                        <textarea
                            id="contact-comment"
                            name="comment"
                            rows={2}
                            placeholder={t.contact?.form?.commentPlaceholder}
                            className="w-full bg-transparent border-b border-zinc-800 py-3 text-lg font-sans text-white placeholder-zinc-700 focus:outline-none focus:border-neon-purple transition-colors resize-none"
                        />
                    </div>

                    <button
                        disabled={isSubmitted}
                        className={`w-full md:w-auto md:px-12 mt-4 font-bold font-mono text-sm uppercase py-5 tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-4 group/btn relative overflow-hidden rounded-full ${isSubmitted ? 'bg-neon-acid text-black cursor-default' : 'bg-white text-black hover:bg-neon-acid'}`}
                    >
                        {isSubmitted ? (
                            <span className="relative z-10 flex items-center gap-2 animate-pulse">
                                <Check size={18} /> {t.contact?.form?.success || 'Sent'}
                            </span>
                        ) : (
                            <>
                                <span className="relative z-10">{t.contact?.form?.submit || 'Send Request'}</span>
                                <Send size={16} className="relative z-10 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
