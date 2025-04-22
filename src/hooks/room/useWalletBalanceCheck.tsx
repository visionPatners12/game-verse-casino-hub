
import { useWallet } from "@/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useWalletBalanceCheck() {
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const [showInsufficientFundsDialog, setShowInsufficientFundsDialog] = useState(false);

  /**
   * Vérifie que le wallet est suffisant ET tente de déduire le montant (transaction DB safe)
   * @param amount Montant à déduire
   * @returns boolean: true si OK, false si insuffisant. Ouvre la modale si insuffisant.
   */
  const checkAndDeductBalance = async (amount: number) => {
    if (!wallet) {
      toast.error("Impossible de vérifier le solde du portefeuille.");
      return false;
    }

    // Si déjà insuffisant côté front, affichage immédiat
    if (wallet.real_balance < amount) {
      console.log("Insufficient funds detected in frontend check:", wallet.real_balance, "<", amount);
      setShowInsufficientFundsDialog(true);
      return false;
    }

    // Appel safe à la fonction Supabase-Postgres pour déduire le montant
    const { data, error } = await supabase.rpc('deduct_entry_fee', {
      p_user_id: wallet.user_id,
      p_amount: amount
    });

    if (error) {
      console.error("Error in deduct_entry_fee RPC:", error);
      // S'il manque le solde, la fonction SQL échoue : info user
      setShowInsufficientFundsDialog(true);
      toast.error("Solde insuffisant.");
      return false;
    }

    console.log("Successfully deducted balance:", amount);
    // Success : solde réellement déduit en DB
    return true;
  };

  const InsufficientFundsDialog = () => (
    <AlertDialog 
      open={showInsufficientFundsDialog} 
      onOpenChange={setShowInsufficientFundsDialog}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Solde insuffisant</AlertDialogTitle>
          <AlertDialogDescription>
            Vous n'avez pas assez d'argent dans votre portefeuille pour rejoindre cette partie.<br />
            Ajoutez des fonds pour continuer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            setShowInsufficientFundsDialog(false);
            navigate("/wallet");
          }}>
            Ajouter des fonds
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    checkAndDeductBalance,
    InsufficientFundsDialog,
    showInsufficientFundsDialog, // Export this state so components can check it
    setShowInsufficientFundsDialog // Export this function so components can reset it
  };
}
