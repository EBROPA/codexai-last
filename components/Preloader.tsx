import React, { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [isExiting, setIsExiting] = useState(false);

  const bootLogs = [
    "INITIALIZING NEURAL KERNEL...",
    "LOADING WEBGL SHADERS...",
    "CALCULATING GEOMETRY...",
    "CONNECTING TO SECURE NODE...",
    "DECRYPTING PORTFOLIO ASSETS...",
    "OPTIMIZING RENDER THREADS...",
    "SYNCHRONIZING AUDIO-VISUALS...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    // Log interval
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[logIndex]]);
        logIndex++;
      }
    }, 300);

    // Progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(logInterval);
          setTimeout(() => setIsExiting(true), 500);
          setTimeout(onComplete, 1500); // Wait for exit anim
          return 100;
        }
        return prev + Math.random() * 5;
      });
    }, 100);

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  if (!isExiting && progress >= 100) {
      // Just waiting for exit anim
  }

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black text-neon-acid font-mono p-8 md:p-12 flex flex-col justify-between transition-transform duration-1000 ease-[0.76, 0, 0.24, 1] ${isExiting ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="flex justify-between items-start">
        <div className="text-xs tracking-widest">
           <div>CODEXAI SYSTEM v3.0</div>
           <div>ARCHITECTURE: QUANTUM</div>
        </div>
        <div className="text-right text-xs">
            <div>STATUS: ONLINE</div>
            <div>LATENCY: 1ms</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 font-mono text-sm h-64 overflow-hidden border border-white/10 p-4 bg-zinc-900/50">
        {logs.map((log, i) => (
          <div key={i} className="flex gap-4">
             <span className="text-zinc-500">
                 {`000${i * 14}`.slice(-4)}:
             </span>
             <span className="typing-effect">{log}</span>
          </div>
        ))}
        <div className="animate-pulse">_</div>
      </div>

      <div>
        <div className="flex justify-between mb-2 text-xs uppercase tracking-widest">
            <span>Compiling Assets</span>
            <span>{Math.floor(progress)}%</span>
        </div>
        <div className="w-full h-1 bg-zinc-800 relative overflow-hidden">
            <div 
                className="h-full bg-neon-acid absolute top-0 left-0 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
            />
        </div>
      </div>
    </div>
  );
};