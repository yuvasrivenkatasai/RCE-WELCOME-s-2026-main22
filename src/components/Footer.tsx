import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="py-8 px-4 border-t border-white/10">
      <div className="container mx-auto text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-gold-light flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">RCE Wishes 2026</span>
        </div>
        
        <p className="text-sm text-muted-foreground mb-2">
          {t.footer.copyright}
        </p>
        <p className="text-sm text-muted-foreground">
          {t.footer.madeWith}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
