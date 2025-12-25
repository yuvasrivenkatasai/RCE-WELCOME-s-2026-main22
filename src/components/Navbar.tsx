import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Menu, X } from 'lucide-react';
import rceLogo from '@/assets/rce-logo.avif';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={rceLogo} 
              alt="RCE Logo" 
              className="w-12 h-12 rounded-xl object-contain bg-white/10 p-1"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-display font-semibold text-foreground">RCE New Year Wishes</h1>
              <p className="text-xs text-muted-foreground">2026</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('hero')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t.nav.home}
            </button>
            <button onClick={() => scrollToSection('how-it-works')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t.nav.howItWorks}
            </button>
            <button onClick={() => scrollToSection('about')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t.nav.about}
            </button>
          </div>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10">
              <button
                onClick={() => setLanguage('EN')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  language === 'EN'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('TE')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  language === 'TE'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                TE
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-4">
              <button onClick={() => scrollToSection('hero')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.home}
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.howItWorks}
              </button>
              <button onClick={() => scrollToSection('about')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                {t.nav.about}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
