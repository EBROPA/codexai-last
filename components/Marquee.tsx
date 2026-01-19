import React from 'react';

interface MarqueeProps {
  text: string;
  reverse?: boolean;
  outline?: boolean;
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({ text, reverse = false, outline = false, className = "" }) => {
  const items = Array.from({ length: 8 });

  return (
    <div className={`relative flex overflow-hidden whitespace-nowrap py-4 ${className}`}>
      <div className={`flex w-max animate-${reverse ? 'marquee-reverse' : 'marquee'} whitespace-nowrap`}>
        {[0, 1].map((group) => (
          <div key={group} className="flex w-max">
            {items.map((_, i) => (
              <span 
                key={`${group}-${i}`} 
                className={`
                  mx-4 text-8xl md:text-[10rem] font-bold font-serif uppercase tracking-tighter leading-none
                  ${outline ? 'text-transparent stroke-white stroke-2' : 'text-white'}
                `}
                style={outline ? { WebkitTextStroke: '1px rgba(255,255,255,0.2)' } : {}}
              >
                {text} <span className="text-neon-acid mx-4">—</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
