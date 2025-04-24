
import { Card } from "@/components/ui/card";
import { useMatches } from "@/hooks/useMatches";
import { Loader2, CalendarIcon, Clock } from "lucide-react";
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

  const placeholderImages = [
    "photo-1488590528505-98d2b5aba04b",
    "photo-1461749280684-dccba630e2f6",
    "photo-1581091226825-a6a2a5aee158",
    "photo-1531297484001-80022131f5a1",
    "photo-1487058792275-0ad4aaf24ca7"
  ];

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
          matches.map((match, index) => (
            <Card 
              key={match.id} 
              className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer group"
              onClick={() => {
                // TODO: Open create bet dialog
                console.log("Match selected:", match);
              }}
            >
              <AspectRatio ratio={16 / 9}>
                <img
                  src={`https://images.unsplash.com/${placeholderImages[index % placeholderImages.length]}?auto=format&fit=crop&w=800&q=80`}
                  alt={match.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
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
                <div className="mt-2 text-sm flex justify-between">
                  <span className="font-medium">{match.participants[0]?.name || 'Équipe A'}</span>
                  <span className="text-muted-foreground">vs</span>
                  <span className="font-medium">{match.participants[1]?.name || 'Équipe B'}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
