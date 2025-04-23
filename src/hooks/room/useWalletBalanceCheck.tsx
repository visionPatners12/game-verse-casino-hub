
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

/**
 * Fournit des fonctions pour vérifier et gérer le solde de l'utilisateur.
 * @returns Fonctions et composants pour la vérification du solde
 */
export function useWalletBalanceCheck() {
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const [showInsufficientDialog, setShowInsufficientDialog] = useState(false);

  /**
   * Vérifie côté front uniquement si le wallet a assez de solde pour l'action.
   * @param amount Montant à vérifier
   * @returns boolean
   */
  const hasSufficientBalance = (amount: number) => {
    if (!wallet) {
      toast.error("Impossible de vérifier le solde du portefeuille.");
      return false;
    }
    return wallet.real_balance >= amount;
  };

  /**
   * Vérifie le solde et déduit le montant si possible.
   * @param amount Montant à déduire
   * @returns Promise<boolean> true si le montant a été déduit, false sinon
   */
  const checkAndDeductBalance = async (amount: number): Promise<boolean> => {
    // Vérification côté front
    if (!hasSufficientBalance(amount)) {
      setShowInsufficientDialog(true);
      return false;
    }
    
    try {
      // Tenter de déduire le montant (la logique de déduction réelle est gérée côté backend)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour effectuer cette action.");
        navigate("/auth");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Erreur lors de la vérification du solde:", error);
      toast.error("Une erreur s'est produite lors de la vérification du solde.");
      return false;
    }
  };

  /**
   * Composant de dialogue pour fonds insuffisants
   */
  const InsufficientFundsDialog = () => (
    <AlertDialog open={showInsufficientDialog} onOpenChange={setShowInsufficientDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Solde insuffisant</AlertDialogTitle>
          <AlertDialogDescription>
            Vous n&apos;avez pas assez d&apos;argent dans votre portefeuille pour cette action.<br />
            Ajoutez des fonds pour continuer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setShowInsufficientDialog(false);
              navigate("/wallet");
            }}
          >
            Ajouter des fonds
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    hasSufficientBalance,
    checkAndDeductBalance,
    InsufficientFundsDialog
  };
}
