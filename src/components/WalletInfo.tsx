import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, PlusCircle, ArrowDownCircle, Clock, DollarSign } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { format } from "date-fns";

const WalletInfo = () => {
  const { wallet, transactions, isLoading } = useWallet();
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Winnings':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'Stake':
        return <DollarSign className="h-4 w-4 text-red-500" />;
      case 'Deposit':
        return <PlusCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

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
                  ${isLoading ? "..." : wallet?.real_balance}
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
                  ${isLoading ? "..." : wallet?.bonus_balance}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1">
              <PlusCircle className="h-4 w-4 mr-2" />
              Deposit
            </Button>
            <Button variant="outline" className="flex-1">
              <ArrowDownCircle className="h-4 w-4 mr-2" />
              Withdraw
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {isLoading ? (
              <p className="text-center text-muted-foreground py-4">Loading transactions...</p>
            ) : transactions?.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No transactions yet</p>
            ) : (
              transactions?.slice(0, 5).map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div className="flex items-center gap-3">
                    <div className={`bg-${tx.type === 'Winnings' ? 'green' : tx.type === 'Stake' ? 'red' : 'blue'}-500/10 p-2 rounded-full`}>
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium">{tx.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.description || `${tx.type} Transaction`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount} {wallet?.currency}
                    </p>
                    <p className="text-xs flex items-center justify-end gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(tx.created_at), 'MMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">View All Transactions</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WalletInfo;
