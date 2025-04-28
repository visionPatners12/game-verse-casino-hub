
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { GamePlatform } from "@/types/futarena";

interface GamerTagPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: GamePlatform;
  onSave: (gamerTag: string) => Promise<void>;
  isLoading?: boolean;
}

export function GamerTagPromptDialog({
  open,
  onOpenChange,
  platform,
  onSave,
  isLoading
}: GamerTagPromptDialogProps) {
  const [gamerTag, setGamerTag] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedGamerTag = gamerTag.trim();
    
    if (!trimmedGamerTag) {
      setError("Veuillez entrer votre identifiant de jeu");
      return;
    }
    
    setError("");
    await onSave(trimmedGamerTag);
  };

  // Prevent dialog from being closed if it's required
  const handleOpenChange = (isOpen: boolean) => {
    // Only allow closing if we're opening it
    if (isOpen) {
      onOpenChange(isOpen);
    }
  };

  const getPlatformLabel = () => {
    switch (platform) {
      case "ps5":
        return "PSN Username";
      case "xbox_series":
        return "Xbox Live Gamertag";
      case "cross_play":
        return "EA ID";
      default:
        return "Gamer Tag";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Configuration requise</DialogTitle>
            <DialogDescription>
              Pour rejoindre cette salle, vous devez configurer votre {getPlatformLabel()}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="gamerTag"
                value={gamerTag}
                onChange={(e) => {
                  setGamerTag(e.target.value);
                  if (error) setError("");
                }}
                placeholder={`Entrez votre ${getPlatformLabel()}`}
                required
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !gamerTag.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Sauvegarder"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
