
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HostInfoCardProps {
  hostUsername: string;
  hostAvatar?: string;
  gamerTag: string;
}

export function HostInfoCard({ hostUsername, hostAvatar, gamerTag }: HostInfoCardProps) {
  return (
    <Card className="bg-casino-dark/5 backdrop-blur-sm border-casino-accent/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-casino-accent shadow-lg">
            <AvatarImage src={hostAvatar} alt={hostUsername} />
            <AvatarFallback className="bg-casino-primary text-white">
              <Users className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{hostUsername}</h3>
            <p className="text-sm text-muted-foreground">
              Gamer Tag: <span className="font-mono text-casino-accent">{gamerTag}</span>
            </p>
            <p className="text-xs text-muted-foreground italic">
              Envoyez l'invitation à ce Gamer Tag pour commencer le match
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
