import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import { useActiveRoomGuard } from "@/hooks/useActiveRoomGuard"; // Ajout du hook

/**
 * A simplified hook that provides wallet functionality for room-related actions
 * @returns The wallet instance and utility functions
 */
export function useWalletCheck() {
  // Ajouter le hook de garde pour les rooms actives
  useActiveRoomGuard();
  
  // Always disable transaction loading to prevent unnecessary API calls
  const { wallet, isLoading } = useWallet({ enableTransactions: false });

  /**
   * Checks if the wallet has sufficient balance for the specified amount
   * @param amount The amount to check
   * @param showToast Whether to show a toast notification if the balance is insufficient
   * @returns true if the balance is sufficient, false otherwise
   */
  const hasSufficientBalance = (amount: number, showToast = true) => {
    if (!wallet) {
      if (showToast) toast.error("Impossible de vérifier le solde du portefeuille.");
      return false;
    }
    
    if (wallet.real_balance < amount) {
      if (showToast) {
        toast.error("Fonds insuffisants", {
          description: "Vous n'avez pas assez d'argent dans votre portefeuille pour cette action."
        });
      }
      return false;
    }
    
    return true;
  };

  return {
    wallet,
    isLoading,
    hasSufficientBalance
  };
}
