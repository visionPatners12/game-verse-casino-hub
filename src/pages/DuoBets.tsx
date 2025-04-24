
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDuoBets } from "@/hooks/useDuoBets";
import { CreateDuoBetDialog } from "@/components/duobets/CreateDuoBetDialog";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Layout } from "@/components/Layout";

export default function DuoBets() {
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

  const getPredictionText = (prediction: 'TeamA' | 'TeamB' | 'Draw') => {
    switch (prediction) {
      case 'TeamA': return 'Victoire Équipe A';
      case 'TeamB': return 'Victoire Équipe B';
      case 'Draw': return 'Match Nul';
    }
  };

  return (
    <Layout>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Paris Duo
            <CreateDuoBetDialog />
          </CardTitle>
          <CardDescription>
            Pariez contre d'autres joueurs sur l'issue de matchs réels
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : bets?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun pari duo pour le moment.
              <br />
              Créez-en un en cliquant sur "Nouveau Pari Duo".
            </div>
          ) : (
            <div className="space-y-4">
              {bets?.map((bet) => (
                <Card key={bet.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {bet.team_a} vs {bet.team_b}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {bet.match_description}
                      </p>
                      <div className="flex gap-2 items-center text-sm">
                        <Badge>
                          Mise: ${bet.amount}
                        </Badge>
                        <Badge variant="outline">
                          {getPredictionText(bet.creator_prediction)}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Créé {formatDistanceToNow(new Date(bet.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </div>
                    </div>
                    <Badge className={getStatusColor(bet.status)}>
                      {bet.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
