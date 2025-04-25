
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
import { Plus } from "lucide-react";
import { useDuoBets } from "@/hooks/useDuoBets";
import { BetForm } from "./components/BetForm";
import type { CreateDuoBetDialogProps } from "./types";
import type { BetFormSchema } from "./schemas/betFormSchema";
import { useNavigate, useLocation } from "react-router-dom";

export function CreateDuoBetDialog({ defaultTeams, open, onOpenChange }: CreateDuoBetDialogProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { createBet } = useDuoBets();
  const navigate = useNavigate();
  const location = useLocation();

  const isOpen = open !== undefined ? open : dialogOpen;
  const setOpen = onOpenChange || setDialogOpen;

  const handleDialogChange = (open: boolean) => {
    setOpen(open);
    
    // Si le dialogue se ferme et que nous ne sommes pas déjà sur la page duo-bets,
    // rediriger vers cette page
    if (!open && !location.pathname.includes('/duo-bets')) {
      navigate("/duo-bets");
    }
  };

  async function onSubmit(values: BetFormSchema) {
    try {
      const betData = {
        amount: values.amount,
        team_a: values.team_a,
        team_b: values.team_b,
        match_description: values.match_description,
        creator_prediction: values.creator_prediction,
        expires_at: values.expires_at
      };

      await createBet.mutateAsync(betData);
      handleDialogChange(false); // Ferme la boîte de dialogue et redirige si nécessaire
    } catch (error) {
      console.error('Form submission error:', error);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un pari duo</DialogTitle>
          <DialogDescription>
            Proposez un pari à un autre utilisateur sur l'issue d'un match.
          </DialogDescription>
        </DialogHeader>

        <BetForm
          defaultTeams={defaultTeams}
          onSubmit={onSubmit}
          isSubmitting={createBet.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
