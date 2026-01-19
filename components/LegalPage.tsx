import React from 'react';
import { useLanguage } from '../lib/i18n';
import { Shield, FileText, CheckCircle } from 'lucide-react';

interface LegalPageProps {
  type: 'userAgreement' | 'privacyPolicy' | 'consent';
}

export const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { lang } = useLanguage();

  const contentMap = {
    userAgreement: {
      title: lang === 'ru' ? 'Пользовательское соглашение' : 'User Agreement',
      icon: <FileText className="w-12 h-12 text-neon-acid mb-6" />,
      text: lang === 'ru' 
        ? "Текст пользовательского соглашения находится в разработке."
        : "User agreement text is under development."
    },
    privacyPolicy: {
      title: lang === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy',
      icon: <Shield className="w-12 h-12 text-neon-acid mb-6" />,
      text: lang === 'ru'
        ? "Текст политики конфиденциальности находится в разработке."
        : "Privacy policy text is under development."
    },
    consent: {
      title: lang === 'ru' ? 'Согласие на обработку данных' : 'Data Processing Consent',
      icon: <CheckCircle className="w-12 h-12 text-neon-acid mb-6" />,
      text: lang === 'ru'
        ? "Текст согласия на обработку персональных данных находится в разработке."
        : "Data processing consent text is under development."
    }
  };

  const currentContent = contentMap[type];

  return (
    <div className="bg-void min-h-screen pt-32 pb-20 text-white px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-start mb-12">
          {currentContent.icon}
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-8">
            {currentContent.title}
          </h1>
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-white/70 text-lg leading-relaxed">
              {currentContent.text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
