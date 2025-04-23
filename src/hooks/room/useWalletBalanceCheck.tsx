
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";

/**
 * Fournit une fonction qui vérifie le solde réel de l'utilisateur et affiche un toast si nécessaire.
 * @returns hasSufficientBalance: fonction qui vérifie si le montant peut être débité
 */
export function useWalletBalanceCheck() {
  // Disable transaction loading since we only need the wallet balance
  const { wallet } = useWallet({ enableTransactions: false });

  /**
   * Vérifie côté front uniquement si le wallet a assez de solde pour l'action.
   * @param amount - Montant à vérifier
   * @returns boolean - true si le solde est suffisant
   */
  const hasSufficientBalance = (amount: number) => {
    if (!wallet) {
      toast.error("Impossible de vérifier le solde du portefeuille.");
      return false;
    }
    
    if (wallet.real_balance < amount) {
      toast.error("Fonds insuffisants", {
        description: "Vous n'avez pas assez d'argent dans votre portefeuille pour cette action."
      });
      return false;
    }
    
    return true;
  };

  return {
    hasSufficientBalance
  };
}
