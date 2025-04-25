import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDuoBets } from "@/hooks/useDuoBets";
import { useSportMonksData } from "@/hooks/useSportMonksData";
import { CreateDuoBetDialog } from "@/components/duobets/CreateDuoBetDialog";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Layout } from "@/components/Layout";
import { Separator } from "@/components/ui/separator";

export default function DuoBets() {
  const { bets, isLoading: isBetsLoading } = useDuoBets();
  const { data: leaguesData, isLoading: isMatchesLoading } = useSportMonksData();

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
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Matchs en Direct</CardTitle>
            <CardDescription>
              Sélectionnez un match pour créer un pari duo
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isMatchesLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="space-y-6">
                {leaguesData?.map((league) => (
                  <div key={league.id} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <img 
                        src={league.image_path} 
                        alt={league.name} 
                        className="h-6 w-6 object-contain"
                      />
                      <h3 className="font-semibold">{league.name}</h3>
                    </div>
                    <div className="grid gap-4">
                      {league.today?.map((match) => (
                        <Card key={match.id} className="p-4">
                          <div className="grid gap-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                {match.participants.map((team) => (
                                  <div key={team.id} className="flex items-center gap-2">
                                    <img 
                                      src={team.image_path} 
                                      alt={team.name}
                                      className="h-8 w-8 object-contain" 
                                    />
                                    <div>
                                      <p className="font-medium">{team.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        Position: {team.meta.position}
                                      </p>
                                    </div>
                                    {team.meta.location === 'home' && (
                                      <span className="mx-2 text-xl font-bold">vs</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <CreateDuoBetDialog />
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <Badge variant="outline">
                                {match.result_info}
                              </Badge>
                              <span className="text-muted-foreground">
                                {formatDistanceToNow(new Date(match.starting_at), {
                                  addSuffix: true,
                                  locale: fr,
                                })}
                              </span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes Paris Duo</CardTitle>
            <CardDescription>
              Vos paris en cours et leur statut
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isBetsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : bets?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun pari duo pour le moment.
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
      </div>
    </Layout>
  );
}
