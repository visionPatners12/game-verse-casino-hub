
import Navigation from "@/components/Navigation";
import WalletInfo from "@/components/WalletInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DepositForm } from "@/components/wallet/DepositForm";
import { WithdrawForm } from "@/components/wallet/WithdrawForm";
import { TransactionsList } from "@/components/wallet/TransactionsList";

const Wallet = () => {
  // Mock transaction history - this would normally come from an API or state management
  const transactions = [
    {
      id: "tx1",
      type: "win",
      amount: 50,
      date: "2023-04-14",
      time: "15:30",
      game: "Ludo",
      description: "Won a game",
    },
    {
      id: "tx2",
      type: "bet",
      amount: -20,
      date: "2023-04-14",
      time: "14:45",
      game: "Checkers",
      description: "Placed a bet",
    },
    {
      id: "tx3",
      type: "deposit",
      amount: 100,
      date: "2023-04-13",
      time: "10:15",
      game: null,
      description: "Credit card deposit",
    },
    {
      id: "tx4",
      type: "withdrawal",
      amount: -75,
      date: "2023-04-10",
      time: "18:20",
      game: null,
      description: "Bank withdrawal",
    },
    {
      id: "tx5",
      type: "purchase",
      amount: -15,
      date: "2023-04-08",
      time: "12:10",
      game: null,
      description: "Store purchase - Premium Avatar",
    },
    {
      id: "tx6",
      type: "referral",
      amount: 25,
      date: "2023-04-05",
      time: "09:45",
      game: null,
      description: "Referral bonus",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Wallet</h1>
        
        <WalletInfo />
        
        <div className="mt-10">
          <Tabs defaultValue="deposit">
            <TabsList className="grid w-full grid-cols-3 md:w-auto">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
              <TabsTrigger value="history">Transaction History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="deposit">
              <Card>
                <CardHeader>
                  <CardTitle>Deposit Funds</CardTitle>
                </CardHeader>
                <CardContent>
                  <DepositForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="withdraw">
              <Card>
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                </CardHeader>
                <CardContent>
                  <WithdrawForm />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <TransactionsList transactions={transactions} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GameVerse Casino. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Wallet;
