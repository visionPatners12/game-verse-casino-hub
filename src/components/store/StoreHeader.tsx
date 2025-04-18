
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface StoreHeaderProps {
  balance: number;
  bonusBalance: number;
  purchaseError: string | null;
}

export const StoreHeader = ({ balance, bonusBalance, purchaseError }: StoreHeaderProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Store</h1>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Your Balance</div>
          <div className="font-medium text-accent">
            ${balance ?? 0}
            <span className="text-foreground/50 text-xs">
              +${bonusBalance ?? 0} bonus
            </span>
          </div>
        </div>
      </div>

      {purchaseError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur d'achat</AlertTitle>
          <AlertDescription>
            {purchaseError}
            {balance < 10 && (
              <div className="mt-2">
                <Link to="/wallet?tab=deposit" className="underline">
                  Recharger votre portefeuille
                </Link>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
