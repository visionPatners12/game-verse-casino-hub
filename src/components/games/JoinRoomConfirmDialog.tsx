
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
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, Trophy } from "lucide-react";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { GameRules } from "@/components/game/GameRules";

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

  const matchSettings = {
    halfLengthMinutes: roomData.half_length_minutes,
    legacyDefending: roomData.legacy_defending_allowed,
    customFormations: roomData.custom_formations_allowed,
    platform: roomData.platform,
    mode: roomData.mode,
    teamType: roomData.team_type,
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer l'accès à la salle</AlertDialogTitle>
          <AlertDialogDescription>
            Veuillez lire attentivement les règles du jeu et de la plateforme avant de rejoindre la partie.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ScrollArea className="h-[60vh] rounded-md pr-4">
          <div className="space-y-6">
            {/* Room Info Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Informations de la salle</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {roomData.current_players}/{roomData.max_players} Joueurs
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${roomData.entry_fee} Mise
                </Badge>
                
                <Badge variant="outline" className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  ${totalPot.toFixed(2)} Cagnotte
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Nombre de gagnants: {roomData.winner_count}</p>
                <p>• Commission: {roomData.commission_rate || 5}%</p>
                <p>• Type de jeu: {roomData.game_type}</p>
              </div>
            </div>

            <Separator />

            {/* Platform Rules */}
            <div className="space-y-4">
              <h3 className="font-semibold">Règles de la plateforme</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• Soyez fair-play et respectueux envers les autres joueurs</p>
                <p>• Toute forme de triche entraînera une exclusion définitive</p>
                <p>• Les décisions des modérateurs sont définitives</p>
                <p>• La mise est bloquée jusqu'à la fin de la partie</p>
                <p>• En cas de déconnexion prolongée, la partie peut être annulée</p>
              </div>
            </div>

            <Separator />

            {/* Game Rules */}
            {isFutArena && (
              <div className="space-y-4">
                <GameRules gameType={roomData.game_type} matchSettings={matchSettings} />
              </div>
            )}
          </div>
        </ScrollArea>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-[120px]"
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
