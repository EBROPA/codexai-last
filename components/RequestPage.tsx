
import React from 'react';
import { ContactForm } from './ContactForm';

export const RequestPage: React.FC = () => {
    return (
        <div className="min-h-screen pt-32 pb-24 px-4 md:px-12 relative overflow-hidden bg-void text-white">
            <div className="max-w-5xl mx-auto w-full relative z-10">
                <ContactForm />
            </div>
        </div>
    );
};
