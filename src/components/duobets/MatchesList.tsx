
import { Card } from "@/components/ui/card";
import { useMatches } from "@/hooks/useMatches";
import { Loader2, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function MatchesList() {
  const { data: matches, isLoading, error } = useMatches();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Erreur lors du chargement des matchs.</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun match disponible pour aujourd'hui.</p>
        <p className="text-sm">Revenez plus tard pour voir les matchs à venir.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {matches.map((match) => {
        // S'assurer que starting_at est une date valide
        const startDate = new Date(match.starting_at);
        const isValidDate = !isNaN(startDate.getTime());
        
        return (
          <Card key={match.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{match.name}</h3>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {isValidDate 
                    ? format(startDate, "d MMMM", { locale: fr })
                    : "Date inconnue"}
                  <Clock className="h-3 w-3 ml-1" />
                  {isValidDate 
                    ? format(startDate, "HH:mm", { locale: fr })
                    : "--:--"}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {match.stage.name} - {match.round.name}
              </div>
              <div className="mt-2 text-sm flex justify-between">
                <span className="font-medium">{match.participants[0]?.name || 'Équipe A'}</span>
                <span className="text-muted-foreground">vs</span>
                <span className="font-medium">{match.participants[1]?.name || 'Équipe B'}</span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
