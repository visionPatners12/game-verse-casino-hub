
import { useMatches } from "@/hooks/useMatches";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { DateSelector } from "./matches/DateSelector";
import { LoadingState } from "./matches/LoadingState";
import { MatchCard } from "./matches/MatchCard/MatchCard";

export function MatchesList() {
  const { 
    matches, 
    isLoading, 
    error, 
    refetch,
    selectedDate, 
    setSelectedDate, 
    nextFiveDays 
  } = useMatches();
  const [retryCount, setRetryCount] = useState(0);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    toast({
      title: "Rechargement",
      description: "Tentative de rechargement des matchs..."
    });
    refetch();
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-lg font-semibold text-red-500 mb-2">Erreur lors du chargement des matchs</p>
        <p className="text-sm text-muted-foreground mb-4">{error.message}</p>
        <Button onClick={handleRetry} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DateSelector
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        nextFiveDays={nextFiveDays}
      />

      {isLoading ? (
        <LoadingState />
      ) : !matches || matches.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground col-span-full">
          <p>Aucun match disponible pour cette date.</p>
          <p className="text-sm">Sélectionnez une autre date pour voir les matchs.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
