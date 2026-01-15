
import React from 'react';
import { Check, X, Minus } from 'lucide-react';
import { useLanguage } from '../lib/i18n';

export const Comparison: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-32 bg-void relative">
       <div className="px-4 md:px-12 max-w-[90rem] mx-auto">
          
          <div className="text-center mb-20">
             <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                {t.comparison.title}
             </h2>
             <p className="text-zinc-500 font-mono uppercase tracking-widest max-w-xl mx-auto">
                {t.comparison.desc}
             </p>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                   <tr className="border-b border-white/20">
                      {t.comparison.headers.map((header, idx) => (
                        <th key={idx} className={`py-6 px-4 font-mono text-xs uppercase text-zinc-500 tracking-widest w-1/4 ${idx === 3 ? 'bg-zinc-900/50 border-t-2 border-neon-acid text-neon-acid' : ''}`}>
                            {header}
                        </th>
                      ))}
                   </tr>
                </thead>
                <tbody className="font-sans text-sm md:text-base text-zinc-300">
                   {t.comparison.rows.map((row, idx) => (
                     <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-6 px-4 font-bold text-white">{row.criteria}</td>
                        <td className={`py-6 px-4 ${row.othersBad ? 'text-zinc-500' : 'text-zinc-500'}`}>
                           <div className="flex items-center gap-2">
                             {row.othersBad ? <Minus size={16}/> : (row.others === '0%' ? <Minus size={16}/> : null)} {row.others}
                           </div>
                        </td>
                        <td className={`py-6 px-4 ${row.freelanceBad ? 'text-red-500' : ''}`}>
                            <div className="flex items-center gap-2">
                                {row.freelanceBad ? <X size={16}/> : (row.freelance === 'Да' ? <Check size={16}/> : null)} {row.freelance}
                            </div>
                        </td>
                        <td className="py-6 px-4 font-bold text-white bg-zinc-900/50">
                            <div className="flex items-center gap-2">
                                {row.codexGood ? <Check size={16} className="text-neon-acid"/> : null} {row.codex}
                            </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </section>
  );
};
