
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RoomInfo } from "@/components/game/join-dialog/RoomInfo";
import { RoomSettings } from "@/components/game/join-dialog/RoomSettings";
import { PlatformRules } from "@/components/game/join-dialog/PlatformRules";
import { DisclaimerSection } from "@/components/game/join-dialog/DisclaimerSection";
import { HostInfoCard } from "@/components/games/HostInfoCard";
import { GamePlatform } from "@/types/futarena";

interface JoinRoomCardProps {
  roomData: {
    current_players: number;
    max_players: number;
    entry_fee: number;
    game_type?: string;
    platform?: GamePlatform;
    half_length_minutes?: number;
    legacy_defending_allowed?: boolean;
    custom_formations_allowed?: boolean;
    mode?: string;
    team_type?: string;
  };
  hostData?: {
    display_name: string;
    users: {
      username: string;
      avatar_url?: string;
      psn_username?: string;
      xbox_gamertag?: string;
      ea_id?: string;
    };
    ea_id?: string;
  };
  isLoading: boolean;
  onJoinConfirm: () => void;
}

export function JoinRoomCard({ roomData, hostData, isLoading, onJoinConfirm }: JoinRoomCardProps) {
  const isFutArena = roomData?.game_type?.toLowerCase() === "futarena" || roomData?.game_type?.toLowerCase() === "eafc25";

  return (
    <Card className="bg-gradient-to-b from-background to-background/95 border-casino-accent/20">
      <CardHeader className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="text-2xl text-casino-accent">👋 Règles des matchs</CardTitle>
            <p className="text-muted-foreground text-sm">
              Veuillez lire et accepter les règles avant de participer
            </p>
          </div>
          <RoomInfo
            currentPlayers={roomData?.current_players}
            maxPlayers={roomData?.max_players}
            entryFee={roomData?.entry_fee}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Separator className="bg-casino-accent/20" />

        {isFutArena && hostData && (
          <>
            <HostInfoCard
              hostUsername={hostData.users.username}
              hostAvatar={hostData.users.avatar_url}
              platform={roomData.platform || 'ps5'}
              psn={hostData.users.psn_username}
              xboxId={hostData.users.xbox_gamertag}
              eaId={hostData.users.ea_id || hostData.ea_id}
            />
            <Separator className="bg-casino-accent/20" />
          </>
        )}

        {isFutArena && (
          <>
            <RoomSettings
              halfLengthMinutes={roomData.half_length_minutes}
              legacyDefendingAllowed={roomData.legacy_defending_allowed}
              customFormationsAllowed={roomData.custom_formations_allowed}
              platform={roomData.platform}
              mode={roomData.mode}
              teamType={roomData.team_type}
            />
            <Separator className="bg-casino-accent/20" />
          </>
        )}

        <PlatformRules />

        <Separator className="bg-casino-accent/20" />

        <DisclaimerSection />

        <div className="pt-4">
          <Button 
            onClick={onJoinConfirm} 
            className="w-full bg-casino-accent hover:bg-casino-accent/90"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "J'ai lu les règles et je rejoins la partie"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
