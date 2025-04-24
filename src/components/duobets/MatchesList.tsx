
import { Card } from "@/components/ui/card";
import { useMatches } from "@/hooks/useMatches";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function MatchesList() {
  const { data: matches, isLoading } = useMatches();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {matches?.map((match) => (
        <Card key={match.id} className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{match.name}</h3>
              <span className="text-sm text-muted-foreground">
                {format(new Date(match.starting_at), "d MMMM à HH:mm", { locale: fr })}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {match.stage.name} - {match.round.name}ème journée
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
