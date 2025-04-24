
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { Match } from "@/hooks/useMatches";
import { LeagueAvatar } from "./LeagueAvatar";
import { TeamDisplay } from "./TeamDisplay";

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const homeTeam = match.participants.find(p => p.meta.location === "home");
  const awayTeam = match.participants.find(p => p.meta.location === "away");
  const homeScore = match.scores.find(s => s.participant_id === homeTeam?.id && s.description === "CURRENT")?.score.goals || 0;
  const awayScore = match.scores.find(s => s.participant_id === awayTeam?.id && s.description === "CURRENT")?.score.goals || 0;

  return (
    <Card 
      className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer group border-2"
      onClick={() => {
        toast({
          title: "Match sélectionné",
          description: `${match.name} (${homeScore} - ${awayScore})`
        });
      }}
    >
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LeagueAvatar 
              image={match.stage?.image_path || null} 
              name={match.stage?.name} 
            />
            <h3 className="font-semibold">{match.stage?.name}</h3>
          </div>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(new Date(match.starting_at), "HH:mm", { locale: fr })}
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          {match.round?.name}
        </div>

        <div className="flex items-center justify-between mt-6">
          <TeamDisplay team={homeTeam} index={0} />
          <div className="font-bold text-muted-foreground text-lg px-2">
            {homeScore} - {awayScore}
          </div>
          <TeamDisplay team={awayTeam} index={1} />
        </div>
      </div>
    </Card>
  );
}
