import React, { useEffect, useState } from 'react';
import { MousePosition } from '../types';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a') || target.classList.contains('interactive')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <div 
        className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-difference hidden md:block"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        <div 
          className={`
            relative -top-3 -left-3 rounded-full border border-white transition-all duration-300 ease-out
            ${isHovering ? 'w-16 h-16 -top-8 -left-8 bg-white/20' : 'w-6 h-6'}
            ${isClicking ? 'scale-75' : 'scale-100'}
          `}
        />
        <div 
          className={`
            absolute top-0 left-0 w-1 h-1 bg-neon-acid rounded-full
            transition-transform duration-75 ease-out
          `}
        />
      </div>
    </>
  );
};
