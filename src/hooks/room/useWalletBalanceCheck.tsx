
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { useState } from "react";
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
 * Fournit une fonction qui vérifie le solde réel de l'utilisateur.
 * @returns hasSufficientBalance(amount): true si le montant peut être débité, false sinon
 */
export function useWalletBalanceCheck() {
  const { wallet } = useWallet();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  /**
   * Vérifie côté front uniquement si le wallet a assez de solde pour l'action.
   * @param amount
   * @returns boolean
   */
  const hasSufficientBalance = (amount: number) => {
    if (!wallet) {
      toast.error("Impossible de vérifier le solde du portefeuille.");
      return false;
    }
    return wallet.real_balance >= amount;
  };

  // Cette fonction servira uniquement à la vérification du solde
  // sans déduction (celle-ci est gérée côté backend)
  const checkBalance = async (amount: number): Promise<boolean> => {
    if (!hasSufficientBalance(amount)) {
      setIsDialogOpen(true);
      return false;
    }
    return true;
  };

  // Composant de dialogue pour fonds insuffisants
  const InsufficientFundsDialog = () => (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Fonds insuffisants</AlertDialogTitle>
          <AlertDialogDescription>
            Vous n'avez pas assez de fonds pour cette action. Veuillez recharger votre compte.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Fermer</AlertDialogCancel>
          <AlertDialogAction onClick={() => window.location.href = "/wallet"}>
            Recharger le compte
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    hasSufficientBalance,
    checkBalance,
    InsufficientFundsDialog
  };
}
