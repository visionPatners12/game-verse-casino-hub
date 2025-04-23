
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useJoinRoom } from "@/hooks/room/useJoinRoom";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";
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
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface JoinGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinGameDialog({ open, onOpenChange }: JoinGameDialogProps) {
  const [roomCode, setRoomCode] = useState("");
  const { joinRoom, isLoading } = useJoinRoom();
  const { hasSufficientBalance } = useWalletBalanceCheck();

  // Statut de la dialog "fonds insuffisants"
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);

  const { wallet } = useWallet();
  const navigate = useNavigate();
  
  // Effet pour nettoyer les styles lorsque le dialogue se ferme
  useEffect(() => {
    if (!showInsufficientDialog) {
      // Réinitialiser les styles
      document.body.style.pointerEvents = "";
      
      const timeoutId = setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [showInsufficientDialog]);

  // Fonction pour fermer proprement le dialogue d'insuffisance de fonds
  const handleCloseInsufficientDialog = () => {
    setShowInsufficientDialog(false);
    document.body.style.pointerEvents = "";
  };

  // Récupération de la room pour check montant si nécessaire
  const getRoomEntryFee = async (code: string): Promise<number | null> => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: room } = await supabase
      .from("game_sessions")
      .select("entry_fee")
      .eq("room_id", code)
      .maybeSingle();
    return room?.entry_fee ?? null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Chercher entry_fee de la room
    const entryFee = await getRoomEntryFee(roomCode.toUpperCase());
    if (entryFee == null) {
      // La validation de joinRoom s'occupera de l'erreur room introuvable
      await joinRoom(roomCode);
      return;
    }
    // Vérifie le solde.
    if (!hasSufficientBalance(entryFee)) {
      setShowInsufficientDialog(true);
      return;
    }
    await joinRoom(roomCode);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Rejoindre un salon de jeu</DialogTitle>
              <DialogDescription>
                Entrez le code de salon à 6 caractères pour rejoindre la partie.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="roomCode">Code du salon</Label>
                <Input
                  id="roomCode"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  placeholder="Entrez le code du salon (ex. ABC123)"
                  className="uppercase"
                  maxLength={6}
                  autoComplete="off"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                disabled={isLoading || roomCode.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Rejoindre le salon"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog 
        open={showInsufficientDialog} 
        onOpenChange={(open) => {
          setShowInsufficientDialog(open);
          if (!open) {
            // Réinitialiser immédiatement et après un délai
            document.body.style.pointerEvents = "";
            setTimeout(() => {
              document.body.style.pointerEvents = "";
            }, 100);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Solde insuffisant</AlertDialogTitle>
            <AlertDialogDescription>
              Vous n&apos;avez pas assez d&apos;argent dans votre portefeuille pour rejoindre cette partie.<br />
              Ajoutez des fonds pour continuer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => {
                handleCloseInsufficientDialog();
              }}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleCloseInsufficientDialog();
                navigate("/wallet");
              }}
            >
              Ajouter des fonds
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
