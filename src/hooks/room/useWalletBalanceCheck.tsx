
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";

/**
 * Fournit une fonction qui vérifie le solde réel de l'utilisateur.
 * @returns checkWalletBalance(amount): true si le montant peut être débité, false sinon
 */
export function useWalletBalanceCheck() {
  const { wallet } = useWallet();

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

  return {
    hasSufficientBalance,
  };
}
