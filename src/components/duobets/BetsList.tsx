
import { Card } from "@/components/ui/card";
import { useDuoBets } from "@/hooks/useDuoBets";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";

interface BetsListProps {
  selectedDate: Date;
}

export function BetsList({ selectedDate }: BetsListProps) {
  const { bets, isLoading } = useDuoBets();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500';
      case 'Active': return 'bg-blue-500';
      case 'Completed': return 'bg-green-500';
      case 'Cancelled': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredBets = bets?.filter((bet) => 
    isSameDay(new Date(bet.created_at), selectedDate)
  ) || [];

  const getPredictionText = (prediction: 'TeamA' | 'TeamB' | 'Draw') => {
    switch (prediction) {
      case 'TeamA': return 'Victoire Équipe A';
      case 'TeamB': return 'Victoire Équipe B';
      case 'Draw': return 'Match Nul';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
        <Card key={bet.id} className="p-4 hover:bg-accent/50 transition-colors">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">
                  {bet.team_a} vs {bet.team_b}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {bet.match_description}
                </p>
              </div>
              <Badge className={getStatusColor(bet.status)}>
                {bet.status}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                Mise: {bet.amount}€
              </Badge>
              <Badge variant="outline">
                {getPredictionText(bet.creator_prediction)}
              </Badge>
              {bet.commission_rate && (
                <Badge variant="outline">
                  Commission: {bet.commission_rate}%
                </Badge>
              )}
            </div>

            <div className="text-xs text-muted-foreground">
              Créé {formatDistanceToNow(new Date(bet.created_at), {
                addSuffix: true,
                locale: fr,
              })}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
