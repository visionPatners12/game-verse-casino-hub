
import { GameType } from "@/components/GameCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { GameRules } from "@/components/game/GameRules";
import { HostInfoCard } from "./HostInfoCard";
import { RoomInfo } from "@/components/game/join-dialog/RoomInfo";
import { GameSettings } from "@/components/game/join-dialog/GameSettings";
import { PlatformRules } from "@/components/game/join-dialog/PlatformRules";
import { DisclaimerSection } from "@/components/game/join-dialog/DisclaimerSection";

interface JoinRoomConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  roomData: {
    game_type: GameType;
    entry_fee: number;
    max_players: number;
    current_players: number;
    winner_count: number;
    commission_rate?: number;
    half_length_minutes?: number;
    legacy_defending_allowed?: boolean;
    custom_formations_allowed?: boolean;
    platform?: string;
    mode?: string;
    team_type?: string;
    host?: {
      username: string;
      avatar_url?: string;
      gamer_tag?: string;
    };
  };
}

export function JoinRoomConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  roomData,
}: JoinRoomConfirmDialogProps) {
  const totalPot = roomData.entry_fee * roomData.current_players * (1 - (roomData.commission_rate || 5)/100);
  const isFutArena = roomData.game_type?.toLowerCase() === "futarena" || roomData.game_type?.toLowerCase() === "eafc25";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-background to-background/95 border-casino-accent/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold text-casino-accent">
            Confirmer l'accès à la salle
          </AlertDialogTitle>
          <AlertDialogDescription>
            Veuillez lire attentivement les règles du jeu et de la plateforme avant de rejoindre la partie.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="h-[60vh] rounded-md pr-4">
          <div className="space-y-6">
            {isFutArena && roomData.host && (
              <div className="space-y-4">
                <h3 className="font-semibold text-casino-accent">Informations du créateur</h3>
                <HostInfoCard 
                  hostUsername={roomData.host.username}
                  hostAvatar={roomData.host.avatar_url}
                  gamerTag={roomData.host.gamer_tag || "Non spécifié"}
                />
              </div>
            )}

            <Separator className="bg-casino-accent/20" />

            <div className="space-y-4">
              <h3 className="font-semibold text-casino-accent">Informations de la salle</h3>
              <RoomInfo 
                currentPlayers={roomData.current_players}
                maxPlayers={roomData.max_players}
                entryFee={roomData.entry_fee}
              />
              
              {isFutArena && (
                <GameSettings
                  halfLengthMinutes={roomData.half_length_minutes}
                  legacyDefendingAllowed={roomData.legacy_defending_allowed}
                  customFormationsAllowed={roomData.custom_formations_allowed}
                  platform={roomData.platform}
                  mode={roomData.mode}
                  teamType={roomData.team_type}
                />
              )}
            </div>

            <Separator className="bg-casino-accent/20" />

            <PlatformRules />

            <Separator className="bg-casino-accent/20" />

            <DisclaimerSection />

            {isFutArena && (
              <>
                <Separator className="bg-casino-accent/20" />
                <div className="space-y-4">
                  <GameRules gameType={roomData.game_type} />
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel className="border-casino-accent text-casino-accent hover:bg-casino-accent/10">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-[120px] bg-casino-accent hover:bg-casino-accent/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "J'ai lu les règles et je rejoins"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
