
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
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface JoinGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinGameDialog({ open, onOpenChange }: JoinGameDialogProps) {
  const [roomCode, setRoomCode] = useState("");
  const { joinRoom, isLoading } = useJoinRoom();
  const { wallet } = useWallet();
  const navigate = useNavigate();

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
    
    // Vérifie le solde directement
    if (!wallet || wallet.real_balance < entryFee) {
      toast.error("Solde insuffisant", {
        description: "Vous n'avez pas assez d'argent dans votre portefeuille pour rejoindre cette partie."
      });
      onOpenChange(false); // Fermer la boîte de dialogue
      return;
    }
    
    // Si on a assez d'argent, on rejoint la room
    await joinRoom(roomCode);
  };

  return (
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
  );
}
