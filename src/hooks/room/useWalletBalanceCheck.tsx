
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";

export const useWalletBalanceCheck = () => {
  const { wallet } = useWallet({ enableTransactions: false });

  const checkBalance = async (amount: number) => {
    if (!wallet || wallet.real_balance < amount) {
      toast.error("Solde insuffisant pour créer cette room");
      return false;
    }
    return true;
  };

  return { checkBalance };
};
