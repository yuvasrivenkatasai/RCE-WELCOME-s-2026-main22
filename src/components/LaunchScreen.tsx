import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface LaunchScreenProps {
  onComplete: () => void;
}

const LaunchScreen = ({ onComplete }: LaunchScreenProps) => {
  const [phase, setPhase] = useState<'intro' | 'countdown' | 'done'>('intro');
  const [countdown, setCountdown] = useState(3);
  const [fadeOut, setFadeOut] = useState(false);

  // Launch celebratory effects during intro
  const launchIntroEffects = useCallback(() => {
    const duration = 2800;
    const animationEnd = Date.now() + duration;
    const colors = ['#FFD700', '#FFA500', '#3498db', '#ffffff', '#e67e22'];

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      // Subtle crackers from sides
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
        zIndex: 101,
        scalar: 0.8,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
        zIndex: 101,
        scalar: 0.8,
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Start intro effects
    const cleanup = launchIntroEffects();

    // Phase 1: Show intro for 3 seconds
    const introTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setFadeOut(false);
        setPhase('countdown');
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(introTimer);
      cleanup?.();
    };
  }, [launchIntroEffects]);

  useEffect(() => {
    if (phase === 'countdown') {
      if (countdown > 0) {
        const timer = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Show rocket emoji briefly, then complete
        const completeTimer = setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setPhase('done');
            onComplete();
          }, 300);
        }, 800);
        return () => clearTimeout(completeTimer);
      }
    }
  }, [phase, countdown, onComplete]);

  if (phase === 'done') return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-500 overflow-hidden ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #1a1a3e 50%, #0d1b2a 100%)',
      }}
    >
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(80)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: Math.random() * 2 + 1.5 + 's',
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
        {/* Shooting stars */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`shooting-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: Math.random() * 80 + '%',
              top: Math.random() * 40 + '%',
              animation: `shooting-star ${3 + Math.random() * 2}s linear infinite`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #3498db 0%, transparent 70%)',
            left: '-10%',
            top: '20%',
            animationDuration: '4s',
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full opacity-15 animate-pulse"
          style={{
            background: 'radial-gradient(circle, #e67e22 0%, transparent 70%)',
            right: '-5%',
            bottom: '10%',
            animationDuration: '5s',
            animationDelay: '1s',
          }}
        />
      </div>

      {phase === 'intro' && (
        <div className="flex flex-col items-center animate-fade-in relative z-10">
          {/* RCE Logo with rotating gear */}
          <div className="relative w-64 h-48 mb-8">
            <svg viewBox="0 0 300 200" className="w-full h-full drop-shadow-2xl">
              {/* C Letter - Static */}
              <path
                d="M60 40 L60 160 L100 160 L100 140 L80 140 L80 60 L100 60 L100 40 Z"
                fill="#2d2d2d"
              />
              <path
                d="M100 40 L140 40 L140 60 L100 60 Z"
                fill="#2d2d2d"
              />
              <path
                d="M100 140 L140 140 L140 160 L100 160 Z"
                fill="#2d2d2d"
              />
              
              {/* R Letter - Static */}
              <path
                d="M160 40 L160 160 L180 160 L180 120 L200 120 L220 160 L245 160 L220 115 
                   C235 110 245 95 245 75 C245 55 230 40 210 40 Z
                   M180 60 L210 60 C220 60 225 67 225 75 C225 83 220 90 210 90 L180 90 Z"
                fill="#e67e22"
              />
              
              {/* Blue Gear - Rotating */}
              <g className="origin-center" style={{ transformOrigin: '150px 120px' }}>
                <g className="animate-spin" style={{ animationDuration: '4s', transformOrigin: '150px 120px' }}>
                  {/* Gear outer ring with teeth */}
                  <circle cx="150" cy="120" r="28" fill="#2980b9" />
                  <circle cx="150" cy="120" r="18" fill="#3498db" />
                  <circle cx="150" cy="120" r="8" fill="#2980b9" />
                  
                  {/* Gear teeth */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                    <rect
                      key={i}
                      x="146"
                      y="88"
                      width="8"
                      height="12"
                      fill="#2980b9"
                      transform={`rotate(${angle} 150 120)`}
                      rx="1"
                    />
                  ))}
                </g>
              </g>
            </svg>
          </div>

          {/* Text below logo */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide text-center drop-shadow-lg">
            RCE Welcomes 2026
          </h1>
          <p className="text-lg md:text-xl text-white/70 tracking-widest">
            Innovation • Excellence • Growth
          </p>
        </div>
      )}

      {phase === 'countdown' && (
        <div className="flex flex-col items-center relative z-10">
          <p className="text-2xl md:text-3xl text-white/80 font-light tracking-wider mb-4">
            Launching in
          </p>
          <div className="relative flex items-center justify-center gap-2">
            <span 
              key={countdown}
              className="text-7xl md:text-9xl font-bold text-white animate-scale-in"
              style={{
                textShadow: '0 0 40px rgba(52, 152, 219, 0.8), 0 0 80px rgba(52, 152, 219, 0.4)',
              }}
            >
              {countdown > 0 ? countdown : '1'}
            </span>
            {countdown === 0 && (
              <span 
                className="text-7xl md:text-9xl animate-scale-in"
                style={{
                  textShadow: '0 0 30px rgba(255, 165, 0, 0.8)',
                }}
              >
                🚀
              </span>
            )}
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes shooting-star {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateX(200px) translateY(200px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default LaunchScreen;
