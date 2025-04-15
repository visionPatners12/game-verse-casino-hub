
import Navigation from "@/components/Navigation";
import WalletInfo from "@/components/WalletInfo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CreditCard, DollarSign, ArrowDownCircle, Clock, Receipt } from "lucide-react";

const Wallet = () => {
  const { toast } = useToast();
  
  // Mock transaction history
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
  
  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Deposit Initiated",
      description: "Your deposit is being processed. Please check your email for confirmation.",
    });
  };
  
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Withdrawal Requested",
      description: "Your withdrawal request has been submitted. Processing may take 1-3 business days.",
    });
  };

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
                  <form onSubmit={handleDeposit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          className="pl-9"
                          min="10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select required>
                        <SelectTrigger id="payment-method">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit-card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="card-number"
                          type="text"
                          placeholder="XXXX XXXX XXXX XXXX"
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          type="text"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          placeholder="XXX"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="referral">Referral Code (Optional)</Label>
                      <Input
                        id="referral"
                        type="text"
                        placeholder="Enter referral code"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Deposit Now
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="withdraw">
              <Card>
                <CardHeader>
                  <CardTitle>Withdraw Funds</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleWithdraw} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdraw-amount">Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="withdraw-amount"
                          type="number"
                          placeholder="Enter amount"
                          className="pl-9"
                          min="20"
                          max="500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="withdraw-method">Withdrawal Method</Label>
                      <Select required>
                        <SelectTrigger id="withdraw-method">
                          <SelectValue placeholder="Select withdrawal method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="credit-card">Credit Card Refund</SelectItem>
                          <SelectItem value="crypto">Cryptocurrency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bank-account">Bank Account Number</Label>
                      <Input
                        id="bank-account"
                        type="text"
                        placeholder="Enter your account number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bank-routing">Routing Number</Label>
                      <Input
                        id="bank-routing"
                        type="text"
                        placeholder="Enter your routing number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="account-name">Account Holder Name</Label>
                      <Input
                        id="account-name"
                        type="text"
                        placeholder="Enter account holder name"
                        required
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Request Withdrawal
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-card border border-border"
                      >
                        <div className="flex items-start gap-3 mb-3 sm:mb-0">
                          {tx.type === "win" && (
                            <div className="bg-green-500/10 p-3 rounded-full">
                              <DollarSign className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                          {tx.type === "bet" && (
                            <div className="bg-red-500/10 p-3 rounded-full">
                              <DollarSign className="h-5 w-5 text-red-500" />
                            </div>
                          )}
                          {tx.type === "deposit" && (
                            <div className="bg-blue-500/10 p-3 rounded-full">
                              <ArrowDownCircle className="h-5 w-5 text-blue-500" />
                            </div>
                          )}
                          {tx.type === "withdrawal" && (
                            <div className="bg-orange-500/10 p-3 rounded-full">
                              <ArrowDownCircle className="h-5 w-5 text-orange-500" />
                            </div>
                          )}
                          {tx.type === "purchase" && (
                            <div className="bg-purple-500/10 p-3 rounded-full">
                              <CreditCard className="h-5 w-5 text-purple-500" />
                            </div>
                          )}
                          {tx.type === "referral" && (
                            <div className="bg-green-500/10 p-3 rounded-full">
                              <Receipt className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                          
                          <div>
                            <div className="font-medium">{tx.description}</div>
                            <div className="text-sm text-muted-foreground">
                              {tx.game ? `${tx.game} Game` : "Wallet Transaction"}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between sm:flex-col sm:items-end">
                          <div
                            className={`font-medium ${
                              tx.amount > 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount)}
                          </div>
                          <div className="text-xs flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {tx.date} at {tx.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
