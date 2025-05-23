
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import AuthForms from "@/components/AuthForms";
import { GamepadIcon, Users, TrophyIcon, DicesIcon, Shield, CreditCard, Clock } from "lucide-react";
import placeholderBackground from "../assets/ludo-background.jpg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameFeature } from "@/components/home/GameFeature";
import { TrustFactor } from "@/components/home/TrustFactor";

const Index = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/games');
    }
  }, [session, navigate]);

  const backgroundImage = placeholderBackground || "linear-gradient(to right, #4f46e5, #7c3aed)";

  return (
    <div className="min-h-screen flex relative bg-background overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-10"
        style={{
          background: typeof backgroundImage === 'string' ? backgroundImage : `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Main Content */}
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-start justify-between gap-8 relative z-10 py-8">
        {/* Left Content Section */}
        <div className="w-full lg:w-7/12 space-y-8">
          {/* Hero Section */}
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GameVerse Casino
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez nos jeux de société en ligne et affrontez des joueurs du monde entier !
            </p>
          </div>

          {/* Game Features */}
          <div className="grid sm:grid-cols-2 gap-4">
            <GameFeature 
              icon={<DicesIcon className="w-8 h-8 text-primary" />}
              title="Ludo"
              description="Le classique jeu de plateau indien revisité pour le digital."
            />
            <GameFeature 
              icon={<GamepadIcon className="w-8 h-8 text-primary" />}
              title="Multi-Jeux"
              description="Une variété de jeux classiques réinventés pour le digital."
            />
          </div>

          {/* Trust Factors */}
          <div className="grid sm:grid-cols-3 gap-4 pt-8">
            <TrustFactor
              icon={<Shield className="w-6 h-6 text-primary" />}
              title="100% Sécurisé"
              description="Paiements cryptés et sécurisés"
            />
            <TrustFactor
              icon={<CreditCard className="w-6 h-6 text-primary" />}
              title="Paiements Faciles"
              description="Visa, Mastercard, PayPal"
            />
            <TrustFactor
              icon={<Clock className="w-6 h-6 text-primary" />}
              title="Support 24/7"
              description="Assistance en direct"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="text-sm text-muted-foreground space-y-2 pt-8">
            <p>
              En vous inscrivant, vous acceptez nos{" "}
              <a href="#" className="text-primary hover:underline">conditions d'utilisation</a> et notre{" "}
              <a href="#" className="text-primary hover:underline">politique de confidentialité</a>.
            </p>
            <p>
              GameVerse Casino s'engage dans le jeu responsable. Pour plus d'informations, consultez notre{" "}
              <a href="#" className="text-primary hover:underline">guide du jeu responsable</a>.
            </p>
          </div>

          {/* Payment Methods */}
          <div className="pt-8">
            <h3 className="text-lg font-semibold mb-4">Moyens de paiement acceptés :</h3>
            <div className="flex flex-wrap gap-4 text-muted-foreground">
              <span className="px-4 py-2 bg-card/60 backdrop-blur-sm rounded-lg border border-border/50">
                Visa
              </span>
              <span className="px-4 py-2 bg-card/60 backdrop-blur-sm rounded-lg border border-border/50">
                Mastercard
              </span>
              <span className="px-4 py-2 bg-card/60 backdrop-blur-sm rounded-lg border border-border/50">
                PayPal
              </span>
              <span className="px-4 py-2 bg-card/60 backdrop-blur-sm rounded-lg border border-border/50">
                Apple Pay
              </span>
            </div>
          </div>
        </div>

        {/* Auth Forms Section */}
        <div className="w-full lg:w-4/12 sticky top-8">
          <div className="backdrop-blur-sm bg-card/90 p-6 rounded-xl border border-border/50 shadow-xl">
            <AuthForms />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
