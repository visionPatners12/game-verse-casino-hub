
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
  };
}

export function JoinRoomConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  roomData,
}: JoinRoomConfirmDialogProps) {
  // Calculate total pot with commission
  const totalPot = roomData.entry_fee * roomData.current_players * (1 - (roomData.commission_rate || 5)/100);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer l'accès à la salle</AlertDialogTitle>
          <AlertDialogDescription>
            Veuillez vérifier les informations de la salle avant de rejoindre la partie.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
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
          
          <div className="text-sm text-muted-foreground">
            <p>• Nombre de gagnants: {roomData.winner_count}</p>
            <p>• Commission: {roomData.commission_rate || 5}%</p>
            <p>• Type de jeu: {roomData.game_type}</p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Rejoindre la salle"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
