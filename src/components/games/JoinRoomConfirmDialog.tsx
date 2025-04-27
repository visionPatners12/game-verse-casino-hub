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
import { HostInfoCard } from "./HostInfoCard";

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

            {/* Room Info Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-casino-accent">Informations de la salle</h3>
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="border-casino-accent bg-casino-dark/10">
                  <Users className="h-3 w-3 mr-1" />
                  {roomData.current_players}/{roomData.max_players} Joueurs
                </Badge>
                
                <Badge variant="outline" className="border-casino-accent bg-casino-dark/10">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${roomData.entry_fee} Mise
                </Badge>
                
                <Badge variant="outline" className="border-casino-accent bg-casino-dark/10">
                  <Trophy className="h-3 w-3 mr-1" />
                  ${totalPot.toFixed(2)} Cagnotte
                </Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <p>• Nombre de gagnants: {roomData.winner_count}</p>
                  <p>• Commission: {roomData.commission_rate || 5}%</p>
                  <p>• Type de jeu: {roomData.game_type}</p>
                </div>
                {isFutArena && (
                  <div className="space-y-2">
                    <p>• Durée mi-temps: {roomData.half_length_minutes} minutes</p>
                    <p>• Legacy Defending: {roomData.legacy_defending_allowed ? "Autorisé" : "Non autorisé"}</p>
                    <p>• Formations personnalisées: {roomData.custom_formations_allowed ? "Autorisées" : "Non autorisées"}</p>
                    <p>• Plateforme: {roomData.platform}</p>
                    <p>• Mode de jeu: {roomData.mode}</p>
                    <p>• Type d'équipes: {roomData.team_type}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator className="bg-casino-accent/20" />

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

            <Separator className="bg-casino-accent/20" />

            {/* Game Rules */}
            {isFutArena && (
              <div className="space-y-4">
                <GameRules gameType={roomData.game_type} />
              </div>
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
