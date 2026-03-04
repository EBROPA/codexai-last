import React from 'react';

export const AboutHeroVisual: React.FC = () => {
    return (
        <div className="relative w-full h-[500px] flex items-center justify-center pointer-events-none select-none">
            {/* Main Container / Perspective */}
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">

                {/* Core Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neon-acid/20 blur-[60px] rounded-full animate-pulse" />

                {/* Inner Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-neon-acid/40 rounded-full flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-neon-acid/10 rounded-full border border-neon-acid animate-ping absolute opacity-20" />
                    <div className="w-2 h-2 bg-neon-acid rounded-full shadow-[0_0_15px_rgba(204,255,0,0.8)]" />
                </div>

                {/* Rotating Rings */}
                {/* Ring 1 - Dashed */}
                <div className="absolute top-0 left-0 w-full h-full border border-white/5 rounded-full animate-[spin_10s_linear_infinite]" />

                {/* Ring 2 - Partial with accent */}
                <div className="absolute top-[10%] left-[10%] w-[80%] h-[80%] border-t border-r border-neon-acid/30 rounded-full animate-[spin_15s_linear_infinite_reverse] transition-all duration-500" />

                {/* Ring 3 - Elliptical Orbit */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] border border-white/10 rounded-[50%] animate-[spin_20s_linear_infinite] opacity-50" />

                {/* Orbital Elements */}
                <div className="absolute top-0 left-1/2 w-4 h-4 -translate-y-2 bg-black border border-white/20 rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite] origin-[0_200px]">
                    <div className="w-1 h-1 bg-white" />
                </div>

                {/* Floating "Data" Cards */}
                <div className="absolute -right-12 top-20 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-lg animate-bounce delay-[0ms]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">System Status</div>
                    </div>
                    <div className="text-neon-acid font-mono text-lg tracking-wider">ONLINE</div>
                </div>

                <div className="absolute -left-16 bottom-20 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-lg animate-bounce delay-[1000ms]">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">Uptime</div>
                    </div>
                    <div className="text-white font-mono text-lg tracking-wider">99.99%</div>
                </div>
            </div>

            {/* Grid overlay for tech feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none" />
        </div>
    );
};
