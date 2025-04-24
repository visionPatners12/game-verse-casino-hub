
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
                console.log("Match selected:", match);
                console.log("Image paths:", {
                  team1: match.participants[0]?.image_path,
                  team2: match.participants[1]?.image_path,
                  league: match.stage?.image_path
                });
              }}
            >
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {match.stage?.image_path ? (
                      <img
                        src={match.stage.image_path}
                        alt={match.stage.name}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    )}
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

                <div className="flex items-center justify-between gap-4 mt-4">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                      {match.participants[0]?.image_path ? (
                        <img
                          src={match.participants[0].image_path}
                          alt={match.participants[0].name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            console.error("Image failed to load:", match.participants[0].image_path);
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://placehold.co/200x200?text=Team";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-center">{match.participants[0]?.name}</span>
                  </div>
                  <span className="text-muted-foreground font-bold">vs</span>
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                      {match.participants[1]?.image_path ? (
                        <img
                          src={match.participants[1].image_path}
                          alt={match.participants[1].name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            console.error("Image failed to load:", match.participants[1].image_path);
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "https://placehold.co/200x200?text=Team";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-center">{match.participants[1]?.name}</span>
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
