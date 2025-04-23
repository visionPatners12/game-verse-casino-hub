import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, PlusCircle, ArrowDownCircle, Clock, DollarSign } from "lucide-react";
// Remove useWallet import, will get wallet and isLoading from props
import { format } from "date-fns";
import { Link } from "react-router-dom";

// Ajoutez ces props pour être utilisé avec ou sans transactions
interface WalletInfoProps {
  wallet: {
    real_balance: number;
    bonus_balance: number;
    currency: string;
  } | null | undefined;
  isLoading: boolean;
}

const WalletInfo = ({ wallet, isLoading }: WalletInfoProps) => {
  // suppression des transactions et du getTransactionIcon
  if (!wallet && !isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">No Wallet Found</h3>
          <p className="text-sm text-muted-foreground mb-4">
            You need to sign in to view your wallet information.
          </p>
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Your Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="balance-card">
              <div className="bg-primary/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Real Balance</p>
                <p className="balance-amount">
                  ${isLoading ? "..." : wallet?.real_balance || 0}
                </p>
              </div>
            </div>
            <div className="balance-card">
              <div className="bg-accent/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bonus Balance</p>
                <p className="balance-amount">
                  ${isLoading ? "..." : wallet?.bonus_balance || 0}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" asChild>
              <Link to="/wallet?tab=deposit">
                <PlusCircle className="h-4 w-4 mr-2" />
                Deposit
              </Link>
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/wallet?tab=withdraw">
                <ArrowDownCircle className="h-4 w-4 mr-2" />
                Withdraw
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      {/* Suppression du bloc Transactions récentes ici */}
    </div>
  );
};

export default WalletInfo;
