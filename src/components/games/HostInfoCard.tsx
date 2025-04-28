
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { GamePlatform } from "@/types/futarena";

interface HostInfoCardProps {
  hostUsername: string;
  hostAvatar?: string;
  platform: GamePlatform;
  psn?: string;
  xboxId?: string;
  eaId?: string;
}

export function HostInfoCard({
  hostUsername,
  hostAvatar,
  platform,
  psn,
  xboxId,
  eaId,
}: HostInfoCardProps) {
  const getGamingId = () => {
    switch (platform) {
      case 'ps5':
        return { label: 'PSN', value: psn };
      case 'xbox_series':
        return { label: 'Xbox', value: xboxId };
      case 'cross_play':
        return { label: 'EA ID', value: eaId };
      default:
        return { label: 'Gaming ID', value: eaId || psn || xboxId };
    }
  };

  const gamingId = getGamingId();

  return (
    <Card className="bg-gradient-to-br from-casino-dark to-background border-casino-accent/20 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-casino-accent shadow-lg">
            <AvatarImage src={hostAvatar} alt={hostUsername} />
            <AvatarFallback className="bg-casino-primary text-white">
              <Users className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Créateur</p>
              <h3 className="text-xl font-bold tracking-tight">{hostUsername}</h3>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{gamingId.label}</p>
              <p className="font-mono text-lg text-casino-accent font-semibold">{gamingId.value || "Non spécifié"}</p>
            </div>
            <p className="text-xs text-muted-foreground/80 italic">
              Pour commencer le match, envoyez une invitation à ce {gamingId.label}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
