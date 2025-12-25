import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SampleGreetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SampleGreetingModal = ({ isOpen, onClose }: SampleGreetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card-strong border-white/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Sample Greeting</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 text-center">
          {/* Header */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Sample Greeting</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-display font-bold gradient-text mb-2">
            Happy New Year 2026, Priya! 🎉
          </h2>
          
          <p className="text-muted-foreground mb-6">
            CSE – 2nd Year Student, Ramachandra College of Engineering
          </p>

          {/* Message */}
          <div className="mb-6">
            <p className="text-lg text-foreground leading-relaxed">
              Dear Priya, as we step into 2026, may this year bring you closer to your dreams of becoming a software engineer. 
              Your dedication to learning and passion for technology will surely lead you to great heights. 
              May every line of code you write bring you success, and may every challenge become an opportunity to grow!
            </p>
          </div>

          {/* Quote */}
          <div className="glass-card p-6 mb-6">
            <p className="text-foreground italic text-lg">
              "The best way to predict your future is to create it. Make 2026 your year of breakthroughs!"
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            With best wishes from the Management, Principal, Faculty, and AIML Department of Ramachandra College of Engineering.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SampleGreetingModal;
