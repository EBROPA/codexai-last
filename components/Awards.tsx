import React from 'react';

export const Awards: React.FC = () => {
  return (
    <div className="fixed bottom-8 left-8 z-40 hidden md:block mix-blend-difference pointer-events-none">
       <div className="relative group">
         <div className="animate-spin-slow w-24 h-24 border border-white/30 rounded-full flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full p-2 fill-white">
              <path id="curve" d="M 50 50 m -37 0 a 37 37 0 1 1 74 0 a 37 37 0 1 1 -74 0" fill="transparent"/>
              <text>
                <textPath xlinkHref="#curve" className="text-[10px] font-mono uppercase tracking-[0.2em]">
                   ★ Site of the Day ★ Awwwards ★
                </textPath>
              </text>
            </svg>
         </div>
         <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif font-bold text-xl text-white">W.</span>
         </div>
       </div>
    </div>
  );
};