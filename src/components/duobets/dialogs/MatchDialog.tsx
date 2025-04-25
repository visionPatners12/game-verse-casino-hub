
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Globe, Lock, X } from "lucide-react";
import { generateBetCode } from "@/lib/utils";
import { toast } from "sonner";
import { useDuoBets } from "@/hooks/useDuoBets";

interface MatchDialogProps {
  match: any;
  leagueName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MatchDialog({ match, leagueName, open, onOpenChange }: MatchDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const { createBet } = useDuoBets();
  const homeTeam = match.participants.find((t: any) => t.meta.location === "home");
  const awayTeam = match.participants.find((t: any) => t.meta.location === "away");

  const possibleGains = selectedAmount * 1.8; // Example multiplier

  const handleCreateBet = async (isPrivate: boolean) => {
    try {
      const betCode = generateBetCode();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48); // Expires in 48 hours
      
      await createBet.mutateAsync({
        amount: selectedAmount,
        creator_prediction: 'TeamA', // Default to home team
        team_a: homeTeam.name,
        team_b: awayTeam.name,
        match_description: `${leagueName} - ${match.stage?.name || match.round?.name || ""}`,
        expires_at: expiresAt.toISOString(),
        bet_code: betCode,
        is_private: isPrivate
      });
      
      toast.success(
        `Pari ${isPrivate ? "privé" : "public"} créé ! Code: ${betCode}`, 
        { duration: 5000 }
      );
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating bet:", error);
      toast.error("Erreur lors de la création du pari");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">Détails du Match</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {leagueName} - {match.stage?.name || match.round?.name || ""}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {format(new Date(match.starting_at), "dd MMMM yyyy - HH:mm", { locale: fr })}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={homeTeam.image_path} alt={homeTeam.name} className="h-8 w-8" />
              <span className="font-medium">{homeTeam.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={awayTeam.image_path} alt={awayTeam.name} className="h-8 w-8" />
              <span className="font-medium">{awayTeam.name}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Montant du pari:</span>
              <div className="flex items-center gap-2">
                {[5, 10, 20, 50].map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedAmount(amount)}
                  >
                    {amount}€
                  </Button>
                ))}
              </div>
            </div>

            <div className="text-sm">
              <span className="font-medium">Gains potentiels: </span>
              <span className="text-green-600 font-bold">{possibleGains}€</span>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <Button
              className="flex-1"
              onClick={() => handleCreateBet(true)}
            >
              <Lock className="mr-2" /> Paris Privé
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleCreateBet(false)}
            >
              <Globe className="mr-2" /> Paris Public
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
