
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MatchCard } from "./MatchCard";

interface LeagueMatchListProps {
  league: {
    id: number;
    name: string;
    image_path: string;
    today: any[];
  };
}

export function LeagueMatchList({ league }: LeagueMatchListProps) {
  if (!league.today || league.today.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-muted-foreground">
        Aucun match aujourd'hui dans cette ligue.
      </div>
    );
  }

  return (
    <div key={league.id} className="space-y-4">
      <div className="flex items-center gap-2 pl-2">
        <img 
          src={league.image_path} 
          alt={league.name} 
          className="h-6 w-6 object-contain"
        />
        <h3 className="font-semibold">{league.name}</h3>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {league.today.map((match) => (
            <MatchCard 
              key={match.id} 
              match={match}
              leagueName={league.name}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
