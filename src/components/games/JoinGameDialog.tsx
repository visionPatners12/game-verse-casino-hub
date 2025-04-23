
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
import { JoinRoomConfirmDialog } from "./JoinRoomConfirmDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GameType } from "@/lib/gameTypes";

interface JoinGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slim?: boolean;
}

export function JoinGameDialog({ open, onOpenChange, slim = false }: JoinGameDialogProps) {
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [roomData, setRoomData] = useState<{
    game_type: GameType;
    entry_fee: number;
    max_players: number;
    current_players: number;
    winner_count: number;
    commission_rate?: number;
  } | null>(null);
  
  const { joinRoom } = useJoinRoom();

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
      
      setRoomData({
        game_type: room.game_type as GameType,
        entry_fee: room.entry_fee,
        max_players: room.max_players,
        current_players: room.current_players,
        winner_count: room.winner_count,
        commission_rate: room.commission_rate
      });
      
      setShowConfirm(true);
    } catch (error: any) {
      console.error("Erreur lors de la recherche du salon:", error);
      toast.error(error.message || "Échec de l'accès au salon. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinConfirm = async () => {
    if (roomData) {
      await joinRoom(roomCode, () => {
        setShowConfirm(false);
        onOpenChange(false);
      });
    }
  };

  return (
    <>
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

      {roomData && (
        <JoinRoomConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          onConfirm={handleJoinConfirm}
          roomData={roomData}
        />
      )}
    </>
  );
}
