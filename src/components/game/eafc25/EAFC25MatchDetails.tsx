
import { RoomData } from "@/components/game/types"; 
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Playstation, Xbox, Globe, Clock, ListChecks } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EAFC25MatchDetailsProps {
  roomData: RoomData;
}

export function EAFC25MatchDetails({ roomData }: EAFC25MatchDetailsProps) {
  const platform = roomData.platform || "ps5";
  const mode = roomData.mode || "online_friendlies";
  const halfLength = roomData.half_length_minutes || 12;
  const legacyDefendingAllowed = roomData.legacy_defending_allowed || false;
  const customFormationsAllowed = roomData.custom_formations_allowed || false;
  const teamType = roomData.team_type || "any_teams";

  const platformInfo = {
    icon: platform === "ps5" ? <Playstation className="h-4 w-4" /> : 
          platform === "xbox_series" ? <Xbox className="h-4 w-4" /> : 
          <Globe className="h-4 w-4" />,
    label: platform === "ps5" ? "PlayStation 5" : 
           platform === "xbox_series" ? "Xbox Series X|S" : 
           "Cross-Play"
  };

  const formatTeamType = (type: string) => {
    switch (type) {
      case "any_teams": return "Any Teams";
      case "national_teams": return "National Teams Only";
      case "club_teams": return "Club Teams Only";
      default: return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  const formatGameMode = (mode: string) => {
    switch (mode) {
      case "online_friendlies": return "Online Friendlies";
      default: return mode.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <CardTitle className="text-sm font-medium mb-4 flex items-center gap-2">
          <ListChecks className="h-4 w-4" />
          Match Settings
        </CardTitle>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Platform</div>
            <div className="flex items-center gap-1">
              {platformInfo.icon}
              <span>{platformInfo.label}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Game Mode</div>
            <div>{formatGameMode(mode)}</div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Half Length</div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{halfLength} minutes</span>
            </div>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">Rules & Settings</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{formatTeamType(teamType)}</Badge>
            <Badge variant={legacyDefendingAllowed ? "default" : "destructive"}>
              {legacyDefendingAllowed ? "Legacy Defending Allowed" : "No Legacy Defending"}
            </Badge>
            <Badge variant={customFormationsAllowed ? "default" : "destructive"}>
              {customFormationsAllowed ? "Custom Formations Allowed" : "No Custom Formations"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
