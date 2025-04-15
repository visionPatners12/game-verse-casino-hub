
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, PlusCircle, ArrowDownCircle, Clock, DollarSign } from "lucide-react";

const WalletInfo = () => {
  // Mock data - would come from an API/context in a real app
  const wallet = {
    realBalance: 500,
    bonusBalance: 100,
    recentTransactions: [
      {
        id: "tx1",
        type: "win",
        amount: 50,
        game: "Ludo",
        timestamp: "2 hours ago",
      },
      {
        id: "tx2",
        type: "bet",
        amount: -20,
        game: "Checkers",
        timestamp: "3 hours ago",
      },
      {
        id: "tx3",
        type: "deposit",
        amount: 100,
        game: null,
        timestamp: "1 day ago",
      },
    ],
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
                <p className="balance-amount">${wallet.realBalance}</p>
              </div>
            </div>
            <div className="balance-card">
              <div className="bg-accent/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bonus Balance</p>
                <p className="balance-amount">${wallet.bonusBalance}</p>
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
            {wallet.recentTransactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="flex items-center gap-3">
                  {tx.type === "win" && (
                    <div className="bg-green-500/10 p-2 rounded-full">
                      <DollarSign className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                  {tx.type === "bet" && (
                    <div className="bg-red-500/10 p-2 rounded-full">
                      <DollarSign className="h-4 w-4 text-red-500" />
                    </div>
                  )}
                  {tx.type === "deposit" && (
                    <div className="bg-blue-500/10 p-2 rounded-full">
                      <PlusCircle className="h-4 w-4 text-blue-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {tx.type === "win"
                        ? "Won a Game"
                        : tx.type === "bet"
                        ? "Placed a Bet"
                        : "Deposit"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tx.game ? `${tx.game} Game` : "Wallet Transaction"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                    {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount)}
                  </p>
                  <p className="text-xs flex items-center justify-end gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {tx.timestamp}
                  </p>
                </div>
              </div>
            ))}
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
