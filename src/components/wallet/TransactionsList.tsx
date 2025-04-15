
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

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  time: string;
  game: string | null;
  description: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
}

export const TransactionsList = ({ transactions }: TransactionsListProps) => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "win":
        return (
          <div className="bg-green-500/10 p-3 rounded-full">
            <DollarSign className="h-5 w-5 text-green-500" />
          </div>
        );
      case "bet":
        return (
          <div className="bg-red-500/10 p-3 rounded-full">
            <DollarSign className="h-5 w-5 text-red-500" />
          </div>
        );
      case "deposit":
        return (
          <div className="bg-blue-500/10 p-3 rounded-full">
            <ArrowDownCircle className="h-5 w-5 text-blue-500" />
          </div>
        );
      case "withdrawal":
        return (
          <div className="bg-orange-500/10 p-3 rounded-full">
            <ArrowDownCircle className="h-5 w-5 text-orange-500" />
          </div>
        );
      case "purchase":
        return (
          <div className="bg-purple-500/10 p-3 rounded-full">
            <CreditCard className="h-5 w-5 text-purple-500" />
          </div>
        );
      case "referral":
        return (
          <div className="bg-green-500/10 p-3 rounded-full">
            <Receipt className="h-5 w-5 text-green-500" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
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
                {getTransactionIcon(tx.type)}
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
                  {tx.amount > 0 ? "+" : ""}{tx.amount}
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
  );
};
