import React, { useEffect, useState } from 'react';

interface SmileyOverlayProps {
  onComplete: () => void;
}

export const SmileyOverlay: React.FC<SmileyOverlayProps> = ({ onComplete }) => {
  const [particles, setParticles] = useState<Array<{ id: number; emoji: string; left: number; top: number; size: number; delay: number }>>([]);

  useEffect(() => {
    // Generate scattered floating emoji sparks
    const emojis = ['😄', '😊', '✨', '⭐', '🚛', '⚡', '💛', '😎'];
    const generated = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.floor(Math.random() * 85) + 5,
      top: Math.floor(Math.random() * 80) + 10,
      size: Math.floor(Math.random() * 24) + 20,
      delay: Math.random() * 0.5
    }));
    setParticles(generated);

    const timer = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center overflow-hidden bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Background radial glow */}
      <div className="absolute w-[500px] h-[500px] bg-amber-400/20 rounded-full blur-[100px] animate-pulse" />

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute animate-bounce"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: '2s'
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Centerpiece Giant Animated Smiley */}
      <div className="relative flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-50 duration-500">
        <div className="text-8xl sm:text-9xl md:text-[140px] drop-shadow-[0_0_35px_rgba(251,191,36,0.8)] animate-pulse select-none">
          😄
        </div>

        <div className="bg-zinc-950/90 border border-amber-500/60 px-6 py-3 rounded-full shadow-2xl shadow-amber-500/20">
          <span className="font-mono text-base sm:text-xl font-bold text-amber-400 tracking-wider flex items-center space-x-2">
            <span>✨ [ SYSTEM ALERT: MAXIMUM CHEER ENGAGED ] ✨</span>
          </span>
        </div>

        <p className="font-mono text-xs sm:text-sm text-zinc-300 bg-zinc-900/80 px-4 py-1.5 rounded-lg border border-zinc-800">
          "Keep on trucking and coding in the fast lane!"
        </p>
      </div>
    </div>
  );
};

export default SmileyOverlay;
