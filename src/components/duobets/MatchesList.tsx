
import { Card } from "@/components/ui/card";
import { useMatches } from "@/hooks/useMatches";
import { Loader2, Clock, Image as ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "../ui/button";
import { AspectRatio } from "../ui/aspect-ratio";

export function MatchesList() {
  const { 
    matches, 
    isLoading, 
    error, 
    selectedDate, 
    setSelectedDate, 
    nextFiveDays 
  } = useMatches();

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

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto py-2 px-1">
        {nextFiveDays.map((date) => (
          <Button
            key={date.toISOString()}
            variant={selectedDate.getDate() === date.getDate() ? "default" : "outline"}
            onClick={() => setSelectedDate(date)}
            className="whitespace-nowrap"
          >
            {format(date, "EEE d MMM", { locale: fr })}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {!matches || matches.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground col-span-full">
            <p>Aucun match disponible pour cette date.</p>
            <p className="text-sm">Sélectionnez une autre date pour voir les matchs.</p>
          </div>
        ) : (
          matches.map((match) => (
            <Card 
              key={match.id} 
              className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => {
                // TODO: Open create bet dialog
                console.log("Match selected:", match);
              }}
            >
              <AspectRatio ratio={16 / 9} className="bg-muted">
                {match.stage.image_path ? (
                  <img
                    src={match.stage.image_path}
                    alt={match.stage.name}
                    className="object-contain w-full h-full p-4 group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <ImageIcon className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                )}
              </AspectRatio>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{match.name}</h3>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(match.starting_at), "HH:mm", { locale: fr })}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {match.stage.name} - {match.round.name}
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <div className="w-8 h-8 shrink-0">
                      {match.participants[0]?.image_path ? (
                        <img
                          src={match.participants[0].image_path}
                          alt={match.participants[0].name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium truncate">{match.participants[0]?.name || 'Équipe A'}</span>
                  </div>
                  <span className="text-muted-foreground font-bold">vs</span>
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="font-medium truncate">{match.participants[1]?.name || 'Équipe B'}</span>
                    <div className="w-8 h-8 shrink-0">
                      {match.participants[1]?.image_path ? (
                        <img
                          src={match.participants[1].image_path}
                          alt={match.participants[1].name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                          <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
