
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

export function useWalletBalanceCheck() {
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const [showInsufficientFundsDialog, setShowInsufficientFundsDialog] = useState(false);

  const checkAndDeductBalance = async (amount: number) => {
    if (!wallet) {
      toast.error("Unable to verify wallet balance");
      return false;
    }

    if (wallet.real_balance < amount) {
      setShowInsufficientFundsDialog(true);
      return false;
    }

    return true;
  };

  const InsufficientFundsDialog = () => {
    return (
      <AlertDialog 
        open={showInsufficientFundsDialog} 
        onOpenChange={setShowInsufficientFundsDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Solde insuffisant</AlertDialogTitle>
            <AlertDialogDescription>
              Vous n'avez pas assez d'argent dans votre portefeuille pour rejoindre cette partie.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/wallet")}>
              Ajouter des fonds
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return {
    checkAndDeductBalance,
    InsufficientFundsDialog
  };
}
