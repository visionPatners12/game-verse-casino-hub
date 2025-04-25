
import React from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MatchInfoProps {
  match: any;
  leagueName: string;
}

export function MatchInfo({ match, leagueName }: MatchInfoProps) {
  const homeTeam = match.participants.find((t: any) => t.meta.location === "home");
  const awayTeam = match.participants.find((t: any) => t.meta.location === "away");

  return (
    <>
      <div>
        <Badge variant="secondary" className="mb-2">
          {leagueName} - {match.stage?.name || match.round?.name || ""}
        </Badge>
        <p className="text-sm text-muted-foreground">
          {format(new Date(match.starting_at), "dd MMMM yyyy - HH:mm", { locale: fr })}
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <img src={homeTeam.image_path} alt={homeTeam.name} className="h-8 w-8" />
          <span className="font-medium">{homeTeam.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <img src={awayTeam.image_path} alt={awayTeam.name} className="h-8 w-8" />
          <span className="font-medium">{awayTeam.name}</span>
        </div>
      </div>
    </>
  );
}
