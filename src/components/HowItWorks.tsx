import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClipboardList, Sparkles, Download, Share2 } from 'lucide-react';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: ClipboardList,
      title: t.howItWorks.step1.title,
      description: t.howItWorks.step1.description,
      color: 'from-violet to-violet-light',
    },
    {
      icon: Sparkles,
      title: t.howItWorks.step2.title,
      description: t.howItWorks.step2.description,
      color: 'from-primary to-gold-light',
    },
    {
      icon: Download,
      title: t.howItWorks.step3.title,
      description: t.howItWorks.step3.description,
      color: 'from-accent to-violet-light',
    },
    {
      icon: Share2,
      title: t.howItWorks.step4.title,
      description: t.howItWorks.step4.description,
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-center mb-4 gradient-text">
          {t.howItWorks.title}
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          {t.hero.subtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="glass-card p-6 relative group hover:border-primary/30 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step number */}
              <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-gold-light flex items-center justify-center text-primary-foreground font-bold text-sm">
                {index + 1}
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>

              {/* Connection line (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
