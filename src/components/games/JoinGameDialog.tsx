
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface JoinGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slim?: boolean;
}

export function JoinGameDialog({ open, onOpenChange, slim = false }: JoinGameDialogProps) {
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data: room, error: roomError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('room_id', roomCode.toUpperCase())
        .maybeSingle();
        
      if (roomError) throw roomError;
      
      if (!room) {
        toast.error("Salon introuvable. Veuillez vérifier le code et réessayer.");
        return;
      }
      
      if (room.current_players >= room.max_players) {
        toast.error("Ce salon est complet. Veuillez essayer un autre salon.");
        return;
      }

      onOpenChange(false);
      navigate(`/games/${room.game_type.toLowerCase()}/confirm-join/${roomCode}`);
    } catch (error: any) {
      console.error("Erreur lors de la recherche du salon:", error);
      toast.error(error.message || "Échec de l'accès au salon. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={slim ? "sm:max-w-[350px]" : "sm:max-w-[425px]"}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rejoindre un salon de jeu</DialogTitle>
            {!slim && (
              <DialogDescription>
                Entrez le code de salon à 6 caractères pour rejoindre la partie.
              </DialogDescription>
            )}
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
                  Recherche...
                </>
              ) : (
                "Vérifier le salon"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
