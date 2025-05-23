import { Card } from "@/components/ui/card";
import { useDuoBets } from "@/hooks/useDuoBets";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Copy, Lock, Globe, Clock } from "lucide-react";
import { formatDistanceToNow, format, isSameDay, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "sonner";
import { DuoBetResult } from "./types";
import { MARKET_DISPLAYS } from "./types";

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

  const getPredictionLabel = (prediction: DuoBetResult, marketId?: number) => {
    if (marketId && MARKET_DISPLAYS[marketId]) {
      return MARKET_DISPLAYS[marketId].getLabel(prediction);
    }
    switch (prediction) {
      case 'TeamA': return '1';
      case 'TeamB': return '2';
      case 'Draw': return 'X';
      default: return prediction;
    }
  };

  const copyBetCode = (code: string) => {
    if (!code) {
      toast.error("Code de pari non disponible");
      return;
    }
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

  const sortedBets = [...filteredBets].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  if (sortedBets.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun pari pour cette date.
      </div>
    );
  }

  return (
    <div className="grid gap-4 w-full max-w-3xl mx-auto">
      {sortedBets.map((bet) => (
        <Card key={bet.id} className="overflow-hidden bg-card/50 backdrop-blur-sm w-full">
          <div className="border-l-4 border-accent p-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="space-y-1">
                  <h3 className="font-semibold tracking-tight">
                    {bet.team_a} vs {bet.team_b}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {format(new Date(bet.created_at), "HH:mm", { locale: fr })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {bet.match_description}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge 
                    variant="outline" 
                    className={`flex items-center ${bet.is_private ? 'bg-purple-500/20 text-purple-500 border-purple-500/50' : 'bg-sky-500/20 text-sky-500 border-sky-500/50'}`}
                  >
                    {bet.is_private ? <Lock className="h-3 w-3 mr-1" /> : <Globe className="h-3 w-3 mr-1" />}
                    {bet.is_private ? 'Privé' : 'Public'}
                  </Badge>
                  <Badge className={`${getStatusColor(bet.status)} border`}>
                    {bet.status}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {bet.amount}€
                  </Badge>
                  <Badge variant="outline" className="font-mono">
                    {getPredictionLabel(bet.creator_prediction, bet.market_id)}
                  </Badge>
                  {bet.market_id && (
                    <Badge variant="secondary">
                      {bet.market_id === 1 ? '1X2' : 'Les deux équipes marquent'}
                    </Badge>
                  )}
                </div>
                
                {bet.bet_code && (
                  <div className="flex items-center gap-1">
                    <div className="bg-muted px-2 py-1 rounded font-mono text-xs flex items-center">
                      <span>Code: {bet.bet_code}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyBetCode(bet.bet_code)}
                        className="h-6 w-6 ml-1 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(bet.created_at), {
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
