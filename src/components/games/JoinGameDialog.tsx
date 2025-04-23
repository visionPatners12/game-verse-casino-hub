
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
import { useWalletCheck } from "@/hooks/room/useWalletCheck";

interface JoinGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slim?: boolean;
}

export function JoinGameDialog({ open, onOpenChange, slim = false }: JoinGameDialogProps) {
  const [roomCode, setRoomCode] = useState("");
  const { joinRoom, isLoading } = useJoinRoom();
  const { wallet } = useWalletCheck();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await joinRoom(roomCode, onOpenChange);
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
