
import { DollarSign } from "lucide-react";
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

export const WithdrawForm = () => {
  const { toast } = useToast();

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Withdrawal Requested",
      description: "Your withdrawal request has been submitted. Processing may take 1-3 business days.",
    });
  };

  return (
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
  );
};
