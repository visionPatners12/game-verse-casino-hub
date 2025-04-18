
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  ArrowDownCircle,
  Clock,
  CreditCard,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";
import { Transaction } from "@/hooks/useWallet";

interface TransactionsListProps {
  transactions: Transaction[];
}

export const TransactionsList = ({ transactions }: TransactionsListProps) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Winnings":
        return (
          <div className="bg-green-500/10 p-3 rounded-full">
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
        );
      case "Stake":
        return (
          <div className="bg-red-500/10 p-3 rounded-full">
            <DollarSign className="h-5 w-5 text-red-500" />
          </div>
        );
      case "Deposit":
        return (
          <div className="bg-blue-500/10 p-3 rounded-full">
            <ArrowDownCircle className="h-5 w-5 text-blue-500" />
          </div>
        );
      case "Withdrawal":
        return (
          <div className="bg-orange-500/10 p-3 rounded-full">
            <ArrowDownCircle className="h-5 w-5 text-orange-500" />
          </div>
        );
      case "StorePurchase":
        return (
          <div className="bg-purple-500/10 p-3 rounded-full">
            <CreditCard className="h-5 w-5 text-purple-500" />
          </div>
        );
      case "ReferralReward":
        return (
          <div className="bg-green-500/10 p-3 rounded-full">
            <Receipt className="h-5 w-5 text-green-500" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-500/10 p-3 rounded-full">
            <DollarSign className="h-5 w-5 text-gray-500" />
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No transactions found.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-card border border-border"
              >
                <div className="flex items-start gap-3 mb-3 sm:mb-0">
                  {getTransactionIcon(tx.type)}
                  <div>
                    <div className="font-medium">{tx.type}</div>
                    <div className="text-sm text-muted-foreground">
                      {tx.description || `${tx.type} Transaction`}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between sm:flex-col sm:items-end">
                  <div
                    className={`font-medium ${
                      tx.amount > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toFixed(2)}
                  </div>
                  <div className="text-xs flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(tx.created_at), "MMM d, yyyy HH:mm")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
