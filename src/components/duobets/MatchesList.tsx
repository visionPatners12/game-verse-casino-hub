
import { Card } from "@/components/ui/card";
import { useMatches } from "@/hooks/useMatches";
import { Loader2, Clock, ImageIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function MatchesList() {
  const { 
    matches, 
    isLoading, 
    error, 
    selectedDate, 
    setSelectedDate, 
    nextFiveDays 
  } = useMatches();

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>Erreur lors du chargement des matchs</p>
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

function MatchCard({ match }) {
  return (
    <Card 
      className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer group"
      onClick={() => {
        console.log("Match selected:", match);
      }}
    >
      <div className="p-4 space-y-4">
        {/* League & Time */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <LeagueAvatar image={match.stage?.image_path} name={match.stage?.name} />
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

        {/* Teams */}
        <div className="flex items-center justify-between mt-6">
          <TeamDisplay team={match.participants[0]} />
          <div className="font-bold text-muted-foreground text-lg px-2">VS</div>
          <TeamDisplay team={match.participants[1]} />
        </div>
      </div>
    </Card>
  );
}

function LeagueAvatar({ image, name }) {
  return (
    <Avatar className="h-8 w-8">
      {image ? (
        <AvatarImage 
          src={image} 
          alt={name || "League"}
          onError={(e) => {
            console.error("League image failed to load:", image);
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://placehold.co/80x80?text=L";
          }}
        />
      ) : null}
      <AvatarFallback>
        <ImageIcon className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}

function TeamDisplay({ team }) {
  if (!team) return <TeamPlaceholder />;
  
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-20 h-20 flex items-center justify-center">
        <Avatar className="w-16 h-16">
          <AvatarImage 
            src={team.image_path || ""} 
            alt={team.name}
            className="object-contain"
            onError={(e) => {
              console.error("Team image failed to load:", team.image_path);
              e.currentTarget.onerror = null;
              e.currentTarget.src = "https://placehold.co/200x200?text=Team";
            }}
          />
          <AvatarFallback className="text-xs">
            {team.name?.substring(0, 2).toUpperCase() || <ImageIcon className="h-6 w-6" />}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="font-medium text-center text-sm line-clamp-2">
        {team.name}
      </span>
    </div>
  );
}

function TeamPlaceholder() {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
        <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <span className="font-medium text-center text-muted-foreground">--</span>
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
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
          
          <Skeleton className="h-4 w-20" />
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex flex-col items-center gap-2 flex-1">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            
            <Skeleton className="h-4 w-4 mx-2" />
            
            <div className="flex flex-col items-center gap-2 flex-1">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
