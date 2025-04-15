
import AuthForms from "@/components/AuthForms";
import { GamepadIcon, Users, TrophyIcon, DicesIcon } from "lucide-react";
import placeholderBackground from "../assets/ludo-background.jpg";
// If the image import fails, we'll use a solid color as fallback
const backgroundImage = placeholderBackground || "linear-gradient(to right, #4f46e5, #7c3aed)";

const Index = () => {
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
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10 py-8">
        {/* Auth Forms Section */}
        <div className="w-full lg:w-5/12 backdrop-blur-sm bg-card/90 p-6 rounded-xl border border-border/50 shadow-xl">
          <AuthForms />
        </div>

        {/* Game Description Section */}
        <div className="w-full lg:w-6/12 space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GameVerse Casino
            </h1>
            <p className="text-xl text-muted-foreground">
              Découvrez nos jeux de société en ligne et affrontez des joueurs du monde entier !
            </p>
          </div>

          <div className="grid gap-6 mt-8">
            {/* Featured Games */}
            <div className="grid sm:grid-cols-2 gap-4">
              <GameFeature 
                icon={<DicesIcon className="w-8 h-8 text-primary" />}
                title="Ludo"
                description="Le classique jeu de plateau indien revisité pour le digital. Stratégie et chance s'entremêlent dans cette aventure captivante."
              />
              <GameFeature 
                icon={<GamepadIcon className="w-8 h-8 text-primary" />}
                title="Tic Tac Toe"
                description="Un jeu simple mais addictif. Alignez trois symboles et remportez la victoire !"
              />
              <GameFeature 
                icon={<TrophyIcon className="w-8 h-8 text-primary" />}
                title="Dames"
                description="Affrontez vos adversaires dans des parties stratégiques intenses."
              />
              <GameFeature 
                icon={<Users className="w-8 h-8 text-primary" />}
                title="Multijoueur"
                description="Jouez en temps réel avec des amis ou des joueurs du monde entier."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GameFeature = ({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="p-4 rounded-lg backdrop-blur-sm bg-card/60 border border-border/50 hover:bg-card/80 transition-colors">
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
