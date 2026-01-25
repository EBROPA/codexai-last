
import React from 'react';
import { useRouter } from '../lib/router';
import { Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export const ThankYouPage: React.FC = () => {
    const router = useRouter();
    const { lang } = useLanguage();

    const title = lang === 'ru' ? 'Заявка отправлена' : 'Request Sent';
    const desc = lang === 'ru'
        ? 'Мы получили вашу заявку и уже анализируем её. Свяжемся с вами в течение 24 часов в Telegram или WhatsApp.'
        : 'We received your request and are already analyzing it. We will contact you within 24 hours via Telegram or WhatsApp.';
    const home = lang === 'ru' ? 'Вернуться на главную' : 'Back to Home';

    return (
        <div className="min-h-screen flex items-center justify-center bg-void text-white relative overflow-hidden px-4">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-acid/10 blur-[150px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-2xl text-center flex flex-col items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-neon-acid/10 flex items-center justify-center border border-neon-acid/20 mb-4">
                    <Check size={48} className="text-neon-acid" />
                </div>

                <h1 className="text-4xl md:text-6xl font-serif font-bold">
                    {title}
                </h1>

                <p className="text-zinc-400 font-mono text-sm md:text-lg leading-relaxed max-w-lg">
                    {desc}
                </p>

                <button
                    onClick={() => router.push('/')}
                    className="px-8 py-4 bg-white text-black font-bold font-mono text-xs uppercase tracking-widest hover:bg-neon-acid transition-colors rounded-full flex items-center gap-2 mt-8"
                >
                    {home}
                    <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
};
