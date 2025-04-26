
import { LucideIcon } from "lucide-react";

interface GameFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const GameFeature = ({ icon, title, description }: GameFeatureProps) => {
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
