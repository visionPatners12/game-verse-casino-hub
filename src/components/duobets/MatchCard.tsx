
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { CreateDuoBetDialog } from "./CreateDuoBetDialog";

interface MatchCardProps {
  match: any;
  leagueName: string;
}

export function MatchCard({ match, leagueName }: MatchCardProps) {
  const getCurrentScore = (match: any) => {
    const homeScore = match.scores?.find(
      (s: any) => s.description === "CURRENT" && s.score.participant === "home"
    );
    const awayScore = match.scores?.find(
      (s: any) => s.description === "CURRENT" && s.score.participant === "away"
    );
    
    if (homeScore && awayScore) {
      return `${homeScore.score.goals} - ${awayScore.score.goals}`;
    }
    return "0 - 0";
  };

  return (
    <Card key={match.id} className="p-4 overflow-hidden">
      <div className="grid gap-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {match.participants.sort((a: any, b: any) => 
              a.meta.location === 'home' ? -1 : 1
            ).map((team: any) => (
              <div key={team.id} className="flex items-center gap-2">
                <img 
                  src={team.image_path} 
                  alt={team.name}
                  className="h-8 w-8 object-contain" 
                />
                <div>
                  <p className="font-medium">{team.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Position: {team.meta.position}
                  </p>
                </div>
                {team.meta.location === 'home' && (
                  <span className="mx-2 text-xl font-bold">vs</span>
                )}
              </div>
            ))}
          </div>
          <CreateDuoBetDialog 
            defaultTeams={{
              teamA: match.participants.find((t: any) => t.meta.location === 'home')?.name || '',
              teamB: match.participants.find((t: any) => t.meta.location === 'away')?.name || '',
              description: `${leagueName} - ${match.stage?.name || match.round?.name || ''}`
            }}
          />
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-bold">
              {getCurrentScore(match)}
            </Badge>
            <Badge variant="outline">
              {match.result_info}
            </Badge>
          </div>
          <span className="text-muted-foreground">
            {formatDistanceToNow(new Date(match.starting_at), {
              addSuffix: true,
              locale: fr,
            })}
          </span>
        </div>
      </div>
    </Card>
  );
}
