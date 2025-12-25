import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-primary)' }}>
      <div className="text-center glass-card-strong p-12 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-gold-light flex items-center justify-center mx-auto mb-6">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <h1 className="text-6xl font-display font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-foreground mb-2">Page Not Found</p>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button asChild variant="hero" size="lg" className="rounded-xl">
          <a href="/">
            <Home className="w-5 h-5 mr-2" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
