
import React, { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight, Zap } from 'lucide-react';
import { useRouter } from '../lib/router';
import { useLanguage } from '../lib/i18n';

export const Hero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const { t } = useLanguage();
  
  // Dual Animation Engine (Sphere for Desktop, Warp Tunnel for Mobile)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    const isMobile = width < 768;

    // --- DESKTOP ANIMATION: NEURAL SPHERE ---
    const initDesktopAnimation = () => {
        const sphereRadius = Math.min(width, height) * 0.22;
        const particlesCount = 1800;
        const rotationSpeed = 0.002;
        let time = 0;
        
        interface Point {
          x: number; y: number; z: number;
          ox: number; oy: number; oz: number;
          phase: number;
        }

        const points: Point[] = [];

        for (let i = 0; i < particlesCount; i++) {
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos((Math.random() * 2) - 1);
          
          const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
          const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
          const z = sphereRadius * Math.cos(phi);

          points.push({ x, y, z, ox: x, oy: y, oz: z, phase: Math.random() * Math.PI * 2 });
        }

        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            mouseX = e.clientX - cx;
            mouseY = e.clientY - cy;
        };
        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Trail effect
          ctx.fillRect(0, 0, width, height);

          const cx = width / 2;
          const cy = height / 2;
          time += 0.01;

          const rotX = rotationSpeed + (mouseY * 0.0001);
          const rotY = rotationSpeed + (mouseX * 0.0001);
          const cosX = Math.cos(rotX);
          const sinX = Math.sin(rotX);
          const cosY = Math.cos(rotY);
          const sinY = Math.sin(rotY);

          points.forEach(p => {
            const noise = Math.sin(time + p.phase) * 15;
            const currentRadius = sphereRadius + noise;
            const scale = currentRadius / sphereRadius;
            
            let x = p.ox * scale;
            let y = p.oy * scale;
            let z = p.oz * scale;

            let x1 = x * cosY - z * sinY;
            let z1 = z * cosY + x * sinY;

            let y1 = y * cosX - z1 * sinX;
            let z2 = z1 * cosX + y * sinX;

            p.ox = x1 / scale;
            p.oy = y1 / scale;
            p.oz = z2 / scale;

            const perspective = 800;
            const scaleProj = perspective / (perspective + z2);
            const x2d = cx + x1 * scaleProj;
            const y2d = cy + y1 * scaleProj;
            const size = (1.5 * scaleProj);
            const alpha = ((z2 + sphereRadius) / (2 * sphereRadius)) * 0.8 + 0.1;

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            if (Math.random() > 0.995) {
                 ctx.fillStyle = `rgba(204, 255, 0, ${alpha})`;
                 ctx.fillRect(x2d, y2d, size*2, size*2);
            } else {
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fill();
            }
          });
          animationId = requestAnimationFrame(animate);
        };
        animate();
        
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    };

    // --- MOBILE ANIMATION: HYPERSPACE TUNNEL ---
    const initMobileAnimation = () => {
        const stars: { x: number; y: number; z: number; o: number }[] = [];
        // OPTIMIZATION: Reduced from 400 to 150 for mobile performance
        const numStars = 150;
        const speed = 2; // Warp speed
        const cx = width / 2;
        const cy = height / 2;

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: (Math.random() - 0.5) * width * 2,
                y: (Math.random() - 0.5) * height * 2,
                z: Math.random() * width,
                o: Math.random()
            });
        }

        const animate = () => {
            // Hard clear for crisp contrast on mobile, or slight trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'; 
            ctx.fillRect(0, 0, width, height);

            stars.forEach(star => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.z = width;
                    star.x = (Math.random() - 0.5) * width * 2;
                    star.y = (Math.random() - 0.5) * height * 2;
                }

                const k = 128.0 / star.z;
                const px = star.x * k + cx;
                const py = star.y * k + cy;
                const size = (1 - star.z / width) * 3;
                
                // Opacity based on depth
                const alpha = (1 - star.z / width);

                if (px >= 0 && px <= width && py >= 0 && py <= height) {
                    // Draw neon streaks
                    ctx.beginPath();
                    ctx.fillStyle = Math.random() > 0.9 ? '#ccff00' : `rgba(255, 255, 255, ${alpha})`;
                    
                    // On mobile, draw mostly squares for "digital" feel
                    ctx.fillRect(px, py, size, size);
                    
                    // Occasional connecting lines for "Network" feel
                    if (Math.random() > 0.98) {
                        ctx.strokeStyle = `rgba(204, 255, 0, ${alpha * 0.5})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(cx, cy);
                        ctx.lineTo(px, py);
                        ctx.stroke();
                    }
                }
            });
            animationId = requestAnimationFrame(animate);
        };
        animate();
        return () => {};
    };

    const cleanup = isMobile ? initMobileAnimation() : initDesktopAnimation();

    const handleResize = () => {
      // Just reload on resize to switch modes if crossing breakpoint
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      cleanup();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative h-screen flex flex-col justify-center items-center overflow-hidden bg-black">
      
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-60"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(5,5,5,0.4) 60%, rgba(5,5,5,0.8) 100%)'
        }}
      ></div>
      
      {/* --- DESKTOP LAYOUT (HIDDEN ON MOBILE) --- */}
      <div className="hidden md:flex relative z-10 w-full max-w-[90rem] mx-auto px-4 md:px-12 h-full flex-col justify-between py-12 pointer-events-none">
        
        {/* Spacer for layout balance */}
        <div className="h-12"></div>

        <div className="text-center relative pointer-events-auto">
            <div className="relative z-20">
                <h1 className="font-serif text-white leading-[0.9] select-none uppercase mb-6 flex flex-col items-center">
                    <span className="block text-[6vw] font-light tracking-tight">{t.hero.titleLine1}</span>
                    <span className="block text-[6vw] font-bold tracking-tighter text-white">{t.hero.titleLine2}</span>
                    
                    <span className="block mt-4">
                        <span className="bg-neon-acid/10 border border-neon-acid/20 text-neon-acid px-4 py-1 rounded-full text-[3vw] font-mono tracking-widest backdrop-blur-md">
                            {t.hero.titleBadge}
                        </span>
                    </span>
                </h1>
            </div>

            <p className="mt-8 text-lg font-mono text-zinc-300 max-w-2xl mx-auto leading-relaxed mix-blend-difference uppercase tracking-wide">
                {t.hero.subtitle}
            </p>

            <div className="mt-12 flex items-center justify-center gap-6">
                <button 
                  onClick={() => router.push('/contact')}
                  className="px-8 py-5 bg-white text-black font-bold font-mono text-sm uppercase tracking-widest hover:bg-neon-acid transition-colors flex items-center justify-center gap-3 group"
                >
                    {t.hero.btnDiscuss}
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                   onClick={() => router.push('/contact')}
                   className="px-8 py-5 border border-white/20 text-white font-mono text-sm uppercase tracking-widest hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                    {t.hero.btnAudit}
                </button>
            </div>
        </div>

        <div className="flex justify-center items-end pointer-events-auto mix-blend-difference">
             <button 
                onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                className="group flex flex-col items-center gap-4 cursor-pointer"
             >
                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-neon-acid transition-colors backdrop-blur-sm">
                    <ArrowDown className="text-white group-hover:text-neon-acid transition-colors animate-bounce" size={16} />
                </div>
             </button>
        </div>
      </div>

      {/* --- MOBILE LAYOUT (REDESIGNED) --- */}
      <div className="md:hidden relative z-10 w-full h-full flex flex-col justify-between px-6 pt-8 pb-10 pointer-events-none">
          
          {/* Mobile Main Content */}
          <div className="flex-1 flex flex-col justify-center gap-6 pointer-events-auto">
              <h1 className="flex flex-col text-left">
                  <span className="text-5xl font-serif font-bold text-white tracking-tighter leading-none mix-blend-overlay opacity-50">{t.hero.mobileTitle1}</span>
                  <span className="text-7xl font-serif font-black text-white tracking-tighter leading-[0.85] mt-2">
                      {t.hero.mobileTitle2}
                  </span>
                  <span className="text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-acid to-white tracking-tighter leading-[0.9]">
                      {t.hero.mobileTitle3}
                  </span>
              </h1>
              
              <div className="w-16 h-1 bg-neon-acid mb-2"></div>

              <p className="text-white text-base font-sans font-medium leading-relaxed max-w-[80%] drop-shadow-md">
                 {t.hero.mobileDesc}
              </p>
          </div>

          {/* Mobile Buttons (Bottom Pinned) */}
          <div className="flex flex-col gap-3 w-full pointer-events-auto mt-auto">
             <button 
                  onClick={() => router.push('/contact')}
                  className="w-full py-5 bg-neon-acid text-black font-bold font-mono text-xs uppercase tracking-widest flex items-center justify-between px-6 shadow-[0_0_20px_rgba(204,255,0,0.3)] active:scale-95 transition-transform"
                >
                    <span>{t.hero.btnDiscuss}</span>
                    <Zap size={16} className="fill-black" />
             </button>
             <button 
                   onClick={() => router.push('/contact')}
                   className="w-full py-5 border border-white/30 bg-black/50 backdrop-blur-md text-white font-mono text-xs uppercase tracking-widest active:scale-95 transition-transform"
                >
                    {t.hero.btnAudit}
             </button>
          </div>
      </div>
    </section>
  );
};
