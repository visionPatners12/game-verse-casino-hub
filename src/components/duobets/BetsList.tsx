
import { Card } from "@/components/ui/card";
import { useDuoBets } from "@/hooks/useDuoBets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Copy } from "lucide-react";
import { formatDistanceToNow, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";

interface BetsListProps {
  selectedDate: Date;
}

export function BetsList({ selectedDate }: BetsListProps) {
  const { bets, isLoading } = useDuoBets();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'Active': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'Completed': return 'bg-green-500/20 text-green-500 border-green-500/50';
      case 'Cancelled': return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getPredictionLabel = (prediction: 'TeamA' | 'TeamB' | 'Draw') => {
    switch (prediction) {
      case 'TeamA': return '1';
      case 'TeamB': return '2';
      case 'Draw': return 'X';
    }
  };

  const copyBetCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copié !");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredBets = bets?.filter((bet) => 
    isSameDay(new Date(bet.created_at), selectedDate)
  ) || [];

  if (filteredBets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun pari pour cette date.
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {filteredBets.map((bet) => (
        <Card key={bet.id} className="overflow-hidden bg-card/50 backdrop-blur-sm">
          <div className="border-l-4 border-accent p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold tracking-tight">
                    {bet.team_a} vs {bet.team_b}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {bet.match_description}
                  </p>
                </div>
                <Badge className={`${getStatusColor(bet.status)} border`}>
                  {bet.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {bet.amount}€
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    {getPredictionLabel(bet.creator_prediction)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded font-mono text-xs">
                    {bet.bet_code}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyBetCode(bet.bet_code)}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Créé {formatDistanceToNow(new Date(bet.created_at), {
                  addSuffix: true,
                  locale: fr,
                })}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
