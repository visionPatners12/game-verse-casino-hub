
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSportMonksData } from "@/hooks/useSportMonksData";
import { Loader2, AlertCircle } from "lucide-react";
import { LeagueMatchList } from "./LeagueMatchList";
import { DateFilter } from "./components/DateFilter";

interface LiveMatchesProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function LiveMatches({ selectedDate, onDateChange }: LiveMatchesProps) {
  const { data: leaguesData, isLoading: isMatchesLoading, error: matchesError } = useSportMonksData(selectedDate);

  if (isMatchesLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (matchesError) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
        <p className="text-muted-foreground">Erreur de chargement des matchs</p>
        <p className="text-xs text-muted-foreground mt-1">Vérifiez votre connexion et réessayez</p>
      </div>
    );
  }

  if (!leaguesData || leaguesData.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun match disponible pour cette date.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DateFilter 
        selectedDate={selectedDate}
        onDateChange={onDateChange}
      />
      
      {leaguesData.map((league) => (
        <LeagueMatchList key={league.id} league={league} />
      ))}
    </div>
  );
}
