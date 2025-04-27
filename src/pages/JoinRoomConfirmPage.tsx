
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
              <CardTitle className="text-2xl">Confirmation de participation</CardTitle>
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
            <p className="text-muted-foreground">
              Vérifiez les règles et paramètres du match avant de rejoindre
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold mb-4">Règles des matchs</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Configuration du match
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
                      <GamepadIcon className="h-4 w-4" /> Paramètres de jeu
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

            <section>
              <h3 className="text-lg font-semibold mb-4">⚠️ Règles importantes</h3>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                <li>Online Squads uniquement</li>
                <li>L'utilisation de Custom Squads ou de joueurs modifiés est interdite</li>
                <li>Respectez les paramètres du match indiqués ci-dessus</li>
                <li>Vérifiez vos paramètres avant de lancer le match</li>
                <li>En cas de non-respect des règles, la partie sera invalidée</li>
              </ul>
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
