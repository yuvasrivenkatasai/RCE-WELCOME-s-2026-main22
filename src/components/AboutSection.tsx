import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Code, Sparkles, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-card p-8 sm:p-12 text-center">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
          
          <h2 className="text-2xl sm:text-3xl font-display font-bold gradient-text mb-6">
            {t.about.title}
          </h2>
          
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {t.about.description}
          </p>

          <div className="glass-card-strong p-6 inline-block">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Code className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">{t.about.creator}</span>
            </div>
            <h3 className="text-xl font-display font-semibold text-foreground mb-1">
              {t.about.creatorName}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t.about.creatorRole}
            </p>
            
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://www.instagram.com/always._.sai._/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-pink-500 transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/Yuva_Mukkala" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/yuva-sri-venkata-sai-mukkala/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-blue-500 transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com/@yuvasrivenkatasai?si=dxMZD9rCpK_O4D6U" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-red-500 transition-colors duration-300"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
