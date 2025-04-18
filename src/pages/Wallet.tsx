
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import WalletInfo from "@/components/WalletInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DepositForm } from "@/components/wallet/DepositForm";
import { WithdrawForm } from "@/components/wallet/WithdrawForm";
import { TransactionsList } from "@/components/wallet/TransactionsList";
import { useWallet } from "@/hooks/useWallet";

const Wallet = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam && ["deposit", "withdraw", "history"].includes(tabParam) 
    ? tabParam 
    : "deposit";

  // Set the tab in the URL when changing tabs
  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };
  
  // Get actual transactions from our hook
  const { transactions } = useWallet();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Wallet</h1>
        
        <WalletInfo />
        
        <div className="mt-10">
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
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
              <TransactionsList 
                transactions={transactions || []}
              />
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
