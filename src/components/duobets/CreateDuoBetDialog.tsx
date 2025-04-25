
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";
import { useDuoBets } from "@/hooks/useDuoBets";
import { BetForm } from "./components/BetForm";
import type { CreateDuoBetDialogProps } from "./types";
import type { BetFormSchema } from "./schemas/betFormSchema";
import { toast } from "sonner";
import { generateBetCode } from "@/lib/utils";

export function CreateDuoBetDialog({ defaultTeams, open, onOpenChange }: CreateDuoBetDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { createBet } = useDuoBets();
  
  // Utiliser l'état contrôlé depuis les props si fourni, sinon utiliser l'état local
  const isOpen = open !== undefined ? open : dialogOpen;
  const setOpen = onOpenChange || setDialogOpen;

  const handleDialogChange = (open: boolean) => {
    setOpen(open);
  };

  async function onSubmit(values: BetFormSchema) {
    try {
      const betCode = generateBetCode();
      
      const betData = {
        amount: values.amount,
        team_a: values.team_a,
        team_b: values.team_b,
        match_description: values.match_description,
        creator_prediction: values.creator_prediction,
        expires_at: values.expires_at,
        bet_code: betCode
      };

      await createBet.mutateAsync(betData);
      toast.success(`Pari créé avec succès! Code du pari: ${betCode}`);
      handleDialogChange(false);
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Erreur lors de la création du pari");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogChange}>
      {!defaultTeams && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau Pari Duo
          </Button>
        </DialogTrigger>
      )}
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un pari duo</DialogTitle>
          <DialogDescription>
            Proposez un pari à un autre utilisateur sur l'issue d'un match.
            Un code unique sera généré pour partager votre pari.
          </DialogDescription>
        </DialogHeader>

        <BetForm
          defaultTeams={defaultTeams}
          onSubmit={onSubmit}
          isSubmitting={createBet.isPending}
        />
        
        <button
          type="button"
          onClick={() => handleDialogChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fermer</span>
        </button>
      </DialogContent>
    </Dialog>
  );
}
