import React, { useRef, useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Download, Link, QrCode, RefreshCw, Home, X, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import html2canvas from 'html2canvas';
import { launchConfetti, launchSchoolPride } from './Fireworks';
import Fireworks from './Fireworks';
import rceLogo from '@/assets/rce-logo.avif';
import { QRCodeSVG } from 'qrcode.react';

export interface GreetingData {
  name: string;
  branch: string;
  year: string;
  greetingTitle: string;
  greetingBody: string;
  motivationalQuote: string;
}

interface GreetingCardProps {
  greeting: GreetingData;
  onNewGreeting: () => void;
  onBackHome: () => void;
  // Optional email (persisted from the form) to send the card to
  userEmail?: string;
}

const GreetingCard = ({ greeting, onNewGreeting, onBackHome, userEmail }: GreetingCardProps) => {
  const { t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [showQRModal, setShowQRModal] = useState(false);

  // Generate unique share URL for this greeting
  const shareUrl = `${window.location.origin}?greeting=${encodeURIComponent(greeting.name)}`;

  // Launch fireworks and confetti when greeting card appears
  useEffect(() => {
    // Initial confetti burst
    launchConfetti();
    
    // School pride effect after a short delay
    setTimeout(() => {
      launchSchoolPride();
    }, 500);
    
    // Another confetti burst
    setTimeout(() => {
      launchConfetti();
    }, 2000);
  }, []);

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a1a',
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: cardRef.current.scrollWidth,
        windowHeight: cardRef.current.scrollHeight,
      });
      
      const link = document.createElement('a');
      link.download = `RCE-NewYear-2026-${greeting.name.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast({
        title: 'Downloaded!',
        description: 'Your greeting card has been saved.',
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'Could not download the card. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Link Copied!',
      description: 'Share link has been copied to clipboard.',
    });
  };

  const handleShowQR = () => {
    setShowQRModal(true);
  };

  // Email sending
  const [sendingEmail, setSendingEmail] = useState(false);
  const handleSendEmail = async () => {
    if (!userEmail) {
      toast({ title: 'No Email', description: 'Please provide your Gmail in the form to receive the greeting.', variant: 'destructive' });
      return;
    }

    const emailLower = userEmail.toLowerCase();
    if (!/^[^\s@]+@gmail\.com$/.test(emailLower)) {
      toast({ title: 'Invalid Email', description: 'Please enter a valid Gmail address (example@gmail.com).', variant: 'destructive' });
      return;
    }

    if (!cardRef.current) return;

    // Inform the user immediately that the email send has started
    toast({ title: 'Sending Email', description: 'Email will be sent to you shortly.' });

    setSendingEmail(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a1a',
        scale: 2,
        useCORS: true,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: cardRef.current.scrollWidth,
        windowHeight: cardRef.current.scrollHeight,
      });

      const dataUrl = canvas.toDataURL('image/png');

      const res = await fetch('/api/send-greeting-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower, imageBase64: dataUrl }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result?.error || 'Failed to send email');
      }

      toast({ title: 'Email Sent', description: 'Your greeting has been sent to your Gmail.' });
    } catch (error) {
      console.error('Send email failed:', error);
      toast({ title: 'Send Failed', description: error instanceof Error ? error.message : 'Failed to send email. Please try again later.', variant: 'destructive' });
    } finally {
      setSendingEmail(false);
    }
  };

  {/* Floating celebration particles */}
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 40 }).map((_, i) => (
      <div
        key={i}
        className="absolute animate-celebration-float"
        style={{
          left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
            }}
          >
            <div 
              className={`rounded-full opacity-70 ${i % 3 === 0 ? 'w-3 h-3 animate-sparkle-burst' : 'w-2 h-2'}`}
              style={{
                backgroundColor: ['hsl(var(--primary))', 'hsl(var(--gold-light))', 'hsl(var(--violet))', 'hsl(var(--accent))', '#FF6B6B', '#4ECDC4'][Math.floor(Math.random() * 6)],
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          </div>
        ))}
        
        {/* Firecracker trails */}
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`trail-${i}`}
            className="absolute animate-firework-trail"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '0',
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <div 
              className="w-1 h-8 rounded-full opacity-80"
              style={{
                background: `linear-gradient(to top, transparent, ${['hsl(var(--primary))', 'hsl(var(--gold-light))', '#FF6B6B', '#FFD93D'][Math.floor(Math.random() * 4)]})`,
              }}
            />
          </div>
        ))}
      </div>
        return (
    <section className="py-20 px-4 relative">      <div className="container mx-auto max-w-3xl relative z-10">

        {/* Card */}
        <div
          ref={cardRef}
          className="relative p-2 rounded-3xl overflow-visible"
          style={{ 
            background: 'linear-gradient(135deg, hsl(45, 90%, 55%) 0%, hsl(35, 85%, 50%) 25%, hsl(280, 70%, 50%) 50%, hsl(200, 80%, 50%) 75%, hsl(45, 90%, 55%) 100%)',
          }}
        >
          {/* Inner card */}
          <div
            className="relative p-8 sm:p-12 rounded-2xl overflow-visible"
            style={{ 
              background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.98) 0%, rgba(15, 15, 35, 0.99) 100%)',
            }}
          >
            {/* Corner decorations */}
            <div className="absolute top-3 left-3 w-10 h-10 border-l-2 border-t-2 border-gold-light/60 rounded-tl-lg" />
            <div className="absolute top-3 right-3 w-10 h-10 border-r-2 border-t-2 border-gold-light/60 rounded-tr-lg" />
            <div className="absolute bottom-3 left-3 w-10 h-10 border-l-2 border-b-2 border-gold-light/60 rounded-bl-lg" />
            <div className="absolute bottom-3 right-3 w-10 h-10 border-r-2 border-b-2 border-gold-light/60 rounded-br-lg" />
            
            {/* Corner stars */}
            <div className="absolute top-5 left-5 text-gold-light text-xl">✦</div>
            <div className="absolute top-5 right-5 text-gold-light text-xl">✦</div>
            <div className="absolute bottom-5 left-5 text-gold-light text-xl">✦</div>
            <div className="absolute bottom-5 right-5 text-gold-light text-xl">✦</div>
            
            {/* Firework sparkles scattered around */}
            <div className="absolute top-12 left-12 text-primary/70 text-sm">✨</div>
            <div className="absolute top-16 right-16 text-violet/70 text-lg">✴</div>
            <div className="absolute top-24 left-8 text-gold-light/60 text-xs">⭐</div>
            <div className="absolute bottom-24 right-10 text-cyan/60 text-sm">✨</div>
            <div className="absolute bottom-16 left-16 text-primary/60 text-lg">✴</div>
            <div className="absolute bottom-12 right-20 text-gold-light/50 text-xs">⭐</div>
            <div className="absolute top-1/3 left-6 text-violet/50 text-sm">✦</div>
            <div className="absolute top-1/2 right-6 text-gold-light/40 text-sm">✦</div>
            <div className="absolute bottom-1/3 left-10 text-cyan/50 text-xs">✨</div>
            <div className="absolute top-20 right-8 text-primary/50 text-xs">⭐</div>
            
            {/* Firework burst decorations */}
            <div className="absolute top-8 left-1/4 flex gap-0.5">
              <div className="w-1 h-1 bg-gold-light/60 rounded-full" />
              <div className="w-0.5 h-0.5 bg-gold-light/40 rounded-full mt-1" />
              <div className="w-0.5 h-0.5 bg-gold-light/40 rounded-full" />
            </div>
            <div className="absolute top-10 right-1/4 flex gap-0.5">
              <div className="w-0.5 h-0.5 bg-violet/50 rounded-full" />
              <div className="w-1 h-1 bg-violet/70 rounded-full" />
              <div className="w-0.5 h-0.5 bg-violet/40 rounded-full mt-1" />
            </div>
            <div className="absolute bottom-10 left-1/3 flex gap-0.5">
              <div className="w-0.5 h-0.5 bg-primary/50 rounded-full mt-1" />
              <div className="w-1 h-1 bg-primary/60 rounded-full" />
              <div className="w-0.5 h-0.5 bg-primary/40 rounded-full" />
            </div>
            <div className="absolute bottom-8 right-1/3 flex gap-0.5">
              <div className="w-0.5 h-0.5 bg-cyan/40 rounded-full" />
              <div className="w-0.5 h-0.5 bg-cyan/50 rounded-full mt-1" />
              <div className="w-1 h-1 bg-cyan/60 rounded-full" />
            </div>
            
            {/* Background glow decorations */}
            <div className="absolute top-8 right-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
            <div className="absolute bottom-8 left-8 w-28 h-28 bg-violet/20 rounded-full blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gold-light/10 rounded-full blur-3xl" />
            
            {/* Header */}
            <div className="relative text-center mb-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                <img src={rceLogo} alt="RCE Logo" className="w-8 h-8 rounded-full object-contain bg-white/20" />
                <span className="text-sm text-primary font-medium">Ramachandra College of Engineering</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-display font-bold gradient-text mb-2">
                {greeting.greetingTitle}
              </h2>
              
              <p className="text-muted-foreground">
                {greeting.branch} – {greeting.year} Year Student
              </p>
            </div>

            {/* Main Message */}
            <div className="relative mb-8 text-center">
              <p className="text-lg text-foreground leading-relaxed whitespace-pre-line">
                {greeting.greetingBody}
              </p>
            </div>

            {/* Motivational Quote */}
            <div className="relative glass-card p-6 mb-8 border border-gold-light/20">
              <div className="text-4xl text-gold-light/40 font-serif absolute -top-2 left-4">"</div>
              <p className="text-center text-foreground italic text-lg pl-8 pr-8">
                {greeting.motivationalQuote}
              </p>
              <div className="text-4xl text-gold-light/40 font-serif absolute -bottom-6 right-4">"</div>
            </div>

            {/* Footer */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {t.greeting.footer}
              </p>
              <p className="text-xs text-gold-light/50">✨ Happy New Year 2026 ✨</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Button
            onClick={handleDownload}
            className="btn-glow bg-gradient-to-r from-primary to-gold-light text-primary-foreground"
          >
            <Download className="w-4 h-4 mr-2" />
            {t.greeting.download}
          </Button>
          
          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            <Link className="w-4 h-4 mr-2" />
            {t.greeting.copyLink}
          </Button>
          
          <Button
            onClick={handleShowQR}
            variant="outline"
            className="border-white/20 bg-white/5 hover:bg-white/10"
          >
            <QrCode className="w-4 h-4 mr-2" />
            {t.greeting.showQR}
          </Button>

          {/* Send to Email */}
          <Button
            onClick={handleSendEmail}
            className="btn-glow bg-gradient-to-r from-primary to-gold-light text-primary-foreground"
            disabled={sendingEmail}
          >
            <Mail className="w-4 h-4 mr-2" />
            {sendingEmail ? 'Sending...' : 'Send to Email'}
          </Button>
        </div>


        {/* Back to Home Button */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <Button
            onClick={onBackHome}
            variant="outline"
            className="border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <Button
            onClick={onNewGreeting}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.greeting.newGreeting}
          </Button>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card-strong p-8 max-w-sm w-full mx-4 relative">
            <button
              onClick={() => setShowQRModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h3 className="text-xl font-display font-bold gradient-text mb-4">
                Scan to Share
              </h3>
              
              <div className="bg-white p-4 rounded-2xl inline-block mb-4">
                <QRCodeSVG 
                  value={shareUrl}
                  size={200}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: rceLogo,
                    x: undefined,
                    y: undefined,
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Scan this QR code to view {greeting.name}'s greeting
              </p>
              
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 hover:bg-white/10"
              >
                <Link className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default GreetingCard;
