
import { DollarSign, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export const DepositForm = () => {
  const { toast } = useToast();

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Deposit Initiated",
      description: "Your deposit is being processed. Please check your email for confirmation.",
    });
  };

  return (
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
  );
};
