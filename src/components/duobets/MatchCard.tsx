
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MatchDialog } from "./dialogs/MatchDialog";

interface MatchCardProps {
  match: any;
  leagueName: string;
}

export function MatchCard({ match, leagueName }: MatchCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const isLive = match.result_info?.toLowerCase().includes("live");
  const isFinished = ["ft", "finished"].some(status => 
    match.result_info?.toLowerCase().includes(status)
  );

  const getMatchStatus = () => {
    if (isLive) return { label: "En direct", className: "bg-red-500" };
    if (isFinished) return { label: "Terminé", className: "bg-gray-500" };
    return { label: "À venir", className: "bg-green-500" };
  };

  const getCurrentScore = () => {
    if (!isLive && !isFinished) return null;

    const homeScore = match.scores?.find(
      (s: any) => s.description === "CURRENT" && s.score.participant === "home"
    );
    const awayScore = match.scores?.find(
      (s: any) => s.description === "CURRENT" && s.score.participant === "away"
    );
    
    if (homeScore && awayScore) {
      return `${homeScore.score.goals} - ${awayScore.score.goals}`;
    }
    return null;
  };

  // Display odds if available
  const getOdds = () => {
    if (!match.odds) return null;
    
    const homeOdds = match.odds.teama?.value;
    const drawOdds = match.odds.draw?.value;
    const awayOdds = match.odds.teamb?.value;
    
    if (!homeOdds && !drawOdds && !awayOdds) return null;
    
    return (
      <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
        <span>{homeOdds ? `1: ${homeOdds}` : '-'}</span>
        <span>{drawOdds ? `X: ${drawOdds}` : '-'}</span>
        <span>{awayOdds ? `2: ${awayOdds}` : '-'}</span>
      </div>
    );
  };

  return (
    <>
      <Card 
        className="w-[280px] hover:bg-accent cursor-pointer transition-colors"
        onClick={() => setDialogOpen(true)}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Badge className={getMatchStatus().className}>
              {getMatchStatus().label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {format(new Date(match.starting_at), "HH:mm", { locale: fr })}
            </span>
          </div>

          <div className="space-y-4">
            {match.participants
              .sort((a: any, b: any) => a.meta.location === "home" ? -1 : 1)
              .map((team: any, index: number) => (
                <div key={team.id} className="flex items-center gap-3">
                  <img 
                    src={team.image_path} 
                    alt={team.name}
                    className="h-6 w-6 object-contain" 
                  />
                  <span className="font-medium">{team.name}</span>
                  {index === 0 && getCurrentScore() && (
                    <span className="ml-auto font-semibold">
                      {getCurrentScore()}
                    </span>
                  )}
                </div>
              ))}
          </div>
          
          {getOdds()}
        </div>
      </Card>

      <MatchDialog
        match={match}
        leagueName={leagueName}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
