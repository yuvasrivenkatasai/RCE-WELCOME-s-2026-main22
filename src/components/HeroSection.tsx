import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Countdown from './Countdown';
import rceLogo from '@/assets/rce-logo.avif';

interface HeroSectionProps {
  onGetGreeting: () => void;
  onViewSample: () => void;
}

const HeroSection = ({ onGetGreeting, onViewSample }: HeroSectionProps) => {
  const { t } = useLanguage();

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-4">
      {/* Decorative elements */}
      <div className="absolute top-1/3 left-10 w-2 h-2 bg-primary rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute top-1/4 right-20 w-3 h-3 bg-violet rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-accent rounded-full animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto text-center max-w-4xl">
        {/* Badge with Logo */}
        <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
          <img src={rceLogo} alt="RCE Logo" className="w-10 h-10 rounded-full object-contain bg-white/20" />
          <span className="text-sm text-primary font-medium">Ramachandra College of Engineering</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <span className="text-foreground">{t.hero.title.split('2026')[0]}</span>
          <span className="gradient-text">2026</span>
          <span className="ml-3">✨</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {t.hero.subtitle}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Button
            onClick={onGetGreeting}
            size="lg"
            className="btn-glow bg-gradient-to-r from-primary to-gold-light text-primary-foreground px-8 py-6 text-lg font-semibold rounded-xl"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {t.hero.cta}
          </Button>
          <Button
            onClick={onViewSample}
            variant="outline"
            size="lg"
            className="border-white/20 bg-white/5 hover:bg-white/10 text-foreground px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
          >
            <Eye className="w-5 h-5 mr-2" />
            {t.hero.viewSample}
          </Button>
        </div>
      </div>

      {/* Countdown */}
      <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Countdown />
      </div>
    </section>
  );
};

export default HeroSection;
