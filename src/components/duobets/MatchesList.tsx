
import { Card } from "@/components/ui/card";
import { useMatches, type Match } from "@/hooks/useMatches";
import { Loader2, Clock, ImageIcon, AlertTriangle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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

  // Fonction pour retenter le chargement en cas d'erreur
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
      <div className="flex gap-2 overflow-x-auto py-2 px-1 no-scrollbar">
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

      {isLoading ? (
        <MatchesListSkeleton />
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

function MatchCard({ match }: { match: Match }) {
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
        {/* League & Time */}
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

        {/* Round */}
        <div className="text-sm text-muted-foreground">
          {match.round?.name}
        </div>

        {/* Teams with Scores */}
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

function LeagueAvatar({ image, name }: { image: string | null, name: string }) {
  const [imageError, setImageError] = useState(false);
  
  return (
    <Avatar className="h-10 w-10 border">
      {image && !imageError ? (
        <AvatarImage 
          src={image} 
          alt={name || "League"}
          className="object-contain p-1"
          onError={() => {
            console.error("League image failed to load:", image);
            setImageError(true);
          }}
        />
      ) : null}
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
        {name?.substring(0, 2).toUpperCase() || <ImageIcon className="h-4 w-4" />}
      </AvatarFallback>
    </Avatar>
  );
}

function TeamDisplay({ team, index }: { team?: { name: string; image_path: string | null }, index: number }) {
  const [imageError, setImageError] = useState(false);
  
  if (!team) {
    return <TeamPlaceholder index={index} />;
  }
  
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-24 h-24 flex items-center justify-center">
        <Avatar className="w-20 h-20 border-2">
          {team.image_path && !imageError ? (
            <AvatarImage 
              src={team.image_path} 
              alt={team.name}
              className="object-contain p-1"
              onError={() => {
                console.error(`Team ${index} image failed to load:`, team.image_path);
                setImageError(true);
              }}
            />
          ) : null}
          <AvatarFallback className="bg-accent/10 text-lg font-bold">
            {team.name?.substring(0, 2).toUpperCase() || `T${index + 1}`}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="font-medium text-center text-sm line-clamp-2 max-w-full">
        {team.name || `Équipe ${index + 1}`}
      </span>
    </div>
  );
}

function TeamPlaceholder({ index }: { index: number }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
        <span className="text-muted-foreground/70 text-lg font-bold">T{index + 1}</span>
      </div>
      <span className="font-medium text-center text-muted-foreground">
        Équipe {index + 1}
      </span>
    </div>
  );
}

function MatchesListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
          
          <Skeleton className="h-4 w-20" />
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex flex-col items-center gap-2 flex-1">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            
            <Skeleton className="h-4 w-4 mx-2" />
            
            <div className="flex flex-col items-center gap-2 flex-1">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
