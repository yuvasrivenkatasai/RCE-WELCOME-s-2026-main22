import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import confetti from 'canvas-confetti';
interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}
const Countdown = () => {
  const {
    t
  } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isComplete, setIsComplete] = useState(false);
  const [prevValues, setPrevValues] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const celebrationTriggered = useRef(false);

  // Launch celebration fireworks
  const launchCelebration = () => {
    if (celebrationTriggered.current) return;
    celebrationTriggered.current = true;
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      // Multiple confetti bursts
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 80,
        origin: {
          x: 0,
          y: 0.7
        },
        colors: colors,
        zIndex: 1000
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 80,
        origin: {
          x: 1,
          y: 0.7
        },
        colors: colors,
        zIndex: 1000
      });
      confetti({
        particleCount: 5,
        angle: 90,
        spread: 100,
        origin: {
          x: 0.5,
          y: 0.8
        },
        colors: colors,
        zIndex: 1000
      });
    }, 150);
  };
  useEffect(() => {
    const targetDate = new Date('January 1, 2026 00:00:00').getTime();
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        const newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(difference % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
          minutes: Math.floor(difference % (1000 * 60 * 60) / (1000 * 60)),
          seconds: Math.floor(difference % (1000 * 60) / 1000)
        };
        setPrevValues(timeLeft);
        setTimeLeft(newTimeLeft);
      } else {
        // Countdown complete
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
        setIsComplete(true);
        launchCelebration();
      }
    };
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const TimeUnit = ({
    value,
    label,
    prevValue
  }: {
    value: number;
    label: string;
    prevValue: number;
  }) => {
    const hasChanged = value !== prevValue;
    return <div className="flex flex-col items-center">
        <div className="glass-card-strong w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center mb-2 relative overflow-hidden" style={{
        boxShadow: '0 0 20px rgba(255, 215, 0, 0.4), 0 0 40px rgba(255, 215, 0, 0.2), inset 0 0 20px rgba(255, 215, 0, 0.1)',
        border: '1px solid rgba(255, 215, 0, 0.3)'
      }}>
          <div key={value} className={`text-3xl sm:text-4xl font-display font-bold ${hasChanged ? 'animate-flip-up' : ''}`} style={{
          color: '#FFD700',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.3)'
        }}>
            {String(value).padStart(2, '0')}
          </div>
        </div>
        <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>;
  };
  return <div className="py-16 px-4">
      <div className="container mx-auto text-center">
        {isComplete ? <>
            {/* Happy New Year Message */}
            <div className="mb-8 animate-scale-in">
              <h2 className="text-4xl sm:text-6xl font-display font-bold mb-4 animate-pulse" style={{
            background: 'linear-gradient(135deg, #FFD700 0%, #FF6B6B 25%, #4ECDC4 50%, #45B7D1 75%, #FFD700 100%)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradient-shift 3s ease infinite, pulse 2s ease-in-out infinite'
          }}>
                🎉 Happy New Year 2026! 🎉
              </h2>
              <p className="text-lg sm:text-xl text-cyan-400/90 font-medium tracking-wide">
                Welcome to a year of Innovation, Excellence & Growth!
              </p>
            </div>
          </> : <>
            <p className="text-sm sm:text-base text-cyan-400/90 font-medium tracking-widest uppercase mb-3 animate-pulse">
              ​        
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-semibold mb-8 gradient-text-violet">
              {t.countdown.title}
            </h2>
          </>}
        
        {/* Timer always visible */}
        <div className="flex justify-center gap-4 sm:gap-6">
          <TimeUnit value={timeLeft.days} label={t.countdown.days} prevValue={prevValues.days} />
          <div className="flex items-center text-2xl text-primary font-bold self-start mt-8">:</div>
          <TimeUnit value={timeLeft.hours} label={t.countdown.hours} prevValue={prevValues.hours} />
          <div className="flex items-center text-2xl text-primary font-bold self-start mt-8">:</div>
          <TimeUnit value={timeLeft.minutes} label={t.countdown.minutes} prevValue={prevValues.minutes} />
          <div className="flex items-center text-2xl text-primary font-bold self-start mt-8">:</div>
          <TimeUnit value={timeLeft.seconds} label={t.countdown.seconds} prevValue={prevValues.seconds} />
        </div>
      </div>

      {/* CSS for flip animation */}
      <style>{`
        @keyframes flip-up {
          0% {
            transform: translateY(100%) rotateX(-90deg);
            opacity: 0;
          }
          50% {
            transform: translateY(0) rotateX(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(0) rotateX(0deg);
            opacity: 1;
          }
        }
        
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animate-flip-up {
          animation: flip-up 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>;
};
export default Countdown;