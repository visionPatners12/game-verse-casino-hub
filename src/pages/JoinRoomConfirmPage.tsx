
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GameType } from "@/components/GameCard";
import { useJoinRoom } from "@/hooks/room/useJoinRoom";
import { Clock, GamepadIcon, Users, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function JoinRoomConfirmPage() {
  const { gameType, roomId } = useParams();
  const navigate = useNavigate();
  const { joinRoom, isLoading } = useJoinRoom();
  const [roomData, setRoomData] = useState<any>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      const { data: room, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('room_id', roomId.toUpperCase())
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching room data:', error);
        toast.error("Erreur lors de la récupération des données de la salle");
        navigate('/games');
        return;
      }
      
      if (!room) {
        toast.error("Salon introuvable");
        navigate('/games');
        return;
      }
      
      setRoomData(room);
    };

    fetchRoomData();
  }, [roomId, navigate]);

  const handleJoinConfirm = async () => {
    if (roomId) {
      await joinRoom(roomId);
    }
  };

  if (!roomData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Chargement...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <CardTitle className="text-2xl">👋 Règles des matchs</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Veuillez lire et accepter les règles avant de participer
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {roomData.current_players}/{roomData.max_players} Joueurs
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  ${roomData.entry_fee}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-4">Configuration du match</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Paramètres de jeu
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Durée mi-temps: {roomData.half_length_minutes} minutes</li>
                      <li>Legacy Defending: {roomData.legacy_defending_allowed ? "Activé" : "Désactivé"}</li>
                      <li>Formations personnalisées: {roomData.custom_formations_allowed ? "Autorisées" : "Non autorisées"}</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <GamepadIcon className="h-4 w-4" /> Configuration
                    </h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>Plateforme: {roomData.platform || "PS5"}</li>
                      <li>Mode de jeu: {roomData.mode || "Online Friendlies"}</li>
                      <li>Type d'équipes: {roomData.team_type || "Any Teams"}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-6 text-sm leading-relaxed">
              <div>
                <p className="mb-4">
                  Si vous recevez une invitation sur votre console qui ne correspond pas aux règles énoncées sur cette page de match, 
                  NE JOUEZ PAS le match. Si vous jouez le match, perdez et soumettez une contestation, les administrateurs de Katchicka 
                  n'approuveront pas votre contestation. Chez Katchicka, nous privilégions le fair-play, avant de prendre toute décision, 
                  nous examinerons et pencherons vers une décision équitable qui nous appartient strictement.
                </p>
                <p className="mb-4">
                  Nous recommandons vivement d'enregistrer tous les résultats de match, déconnexions, règles enfreintes, etc.
                </p>
              </div>

              <div className="space-y-2">
                <p>
                  Si un joueur enfreint une règle lorsqu'il perd le match ou que le match est à égalité et que son adversaire 
                  quitte immédiatement le match, le joueur qui a enfreint la règle perdra le match.
                </p>
                <p>
                  Si un joueur enfreint une règle lorsqu'il mène et que son adversaire quitte immédiatement le match, 
                  le match sera annulé et les deux joueurs seront remboursés de leurs frais d'inscription.
                </p>
              </div>

              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                <p className="font-semibold mb-2">⚠️ Identifiants de jeu:</p>
                <p>
                  Ce match n'est valable que s'il est joué entre les identifiants listés ci-dessus. 
                  Si vous acceptez de jouer tout le match et perdez, puis contestez - votre contestation 
                  ne sera pas prise en considération.
                </p>
              </div>

              <div className="space-y-2">
                <p className="font-medium">
                  Score Auto-Confirmé Après 10 Minutes:
                </p>
                <p>
                  Une fois qu'un score est rapporté, l'autre joueur dispose de 10 minutes pour confirmer 
                  ou contester avant que le premier score rapporté ne soit automatiquement confirmé.
                </p>
              </div>

              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <p className="font-semibold text-red-500 mb-2">⚠️ Avertissement:</p>
                <p>
                  La soumission de résultats faux ou falsifiés entraînera des pénalités financières immédiates.
                </p>
                <ul className="list-disc pl-4 mt-2 space-y-1">
                  <li>1ère infraction = 5€</li>
                  <li>2ème infraction = 25€</li>
                  <li>3ème infraction = Suppression de 100% du solde + Bannissement</li>
                </ul>
              </div>

              <p>
                Tout match nécessitant plusieurs parties doit être prêt à jouer dans les 15 minutes 
                suivant la dernière partie. Le non-respect de cette règle entraînera un forfait.
              </p>

              <p className="text-xs text-muted-foreground mt-4">
                Katchicka n'est ni approuvé par, ni directement affilié à, ni maintenu ou sponsorisé 
                par Apple Inc, Electronic Arts, Activision Blizzard, Take-Two Interactive, Microsoft, 
                Xbox, Sony, Playstation ou Epic Games. Tous les contenus, titres de jeux, noms 
                commerciaux et/ou habillages commerciaux, marques déposées, illustrations et images 
                associées sont des marques déposées et/ou des documents protégés par le droit d'auteur 
                de leurs propriétaires respectifs.
              </p>
            </section>

            <div className="pt-4">
              <Button 
                onClick={handleJoinConfirm} 
                className="w-full"
                disabled={isLoading}
              >
                J'ai lu les règles et je rejoins la partie
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
