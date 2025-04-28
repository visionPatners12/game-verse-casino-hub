
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GameType } from "@/components/GameCard";
import { useJoinRoom } from "@/hooks/room/useJoinRoom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { GameSettings } from "@/components/game/join-dialog/GameSettings";
import { PlatformRules } from "@/components/game/join-dialog/PlatformRules";
import { DisclaimerSection } from "@/components/game/join-dialog/DisclaimerSection";
import { HostInfoCard } from "@/components/games/HostInfoCard";
import { RoomInfo } from "@/components/game/join-dialog/RoomInfo";
import { Loader2 } from "lucide-react";
import { GamePlatform } from "@/types/futarena";

export default function JoinRoomConfirmPage() {
  const { gameType, roomId } = useParams();
  const navigate = useNavigate();
  const { joinRoom, isLoading } = useJoinRoom();
  const [roomData, setRoomData] = useState<any>(null);
  const [hostData, setHostData] = useState<any>(null);
  const [isRoomLoading, setIsRoomLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      try {
        setIsRoomLoading(true);
        console.log("Fetching room data for roomId:", roomId);
        
        // Récupérer les données de la salle avec la requête JOIN pour le host
        const { data: room, error } = await supabase
          .from('game_sessions')
          .select(`
            *,
            game_players!game_players_session_id_fkey (
              id, 
              user_id,
              display_name,
              ea_id,
              users:user_id (
                username,
                avatar_url,
                psn_username,
                xbox_gamertag,
                ea_id
              )
            )
          `)
          .eq('room_id', roomId.toUpperCase())
          .single();
          
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

        console.log("Données de la salle récupérées:", room);
        setRoomData(room);
        
        // S'il y a des joueurs dans la salle, le premier est probablement le créateur
        if (room.game_players && room.game_players.length > 0) {
          const host = room.game_players[0];
          console.log("Host data:", host);
          setHostData(host);
        }
        
        // Pour les jeux de type EAFC25/FutArena, récupérer les configurations supplémentaires
        if (room.game_type?.toLowerCase() === 'eafc25' || room.game_type?.toLowerCase() === 'futarena') {
          const { data: arenaConfig, error: configError } = await supabase
            .from('arena_game_sessions')
            .select('*')
            .eq('id', room.id)
            .single();
            
          if (configError) {
            console.error('Error fetching arena configuration:', configError);
          } else if (arenaConfig) {
            console.log("Configuration arène récupérée:", arenaConfig);
            setRoomData(prev => ({
              ...prev,
              ...arenaConfig
            }));
          }
        }
      } catch (error: any) {
        console.error('Error:', error);
        toast.error("Une erreur s'est produite");
        navigate('/games');
      } finally {
        setIsRoomLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId, navigate]);

  const handleJoinConfirm = async () => {
    if (roomId) {
      await joinRoom(roomId);
    }
  };

  if (isRoomLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
            <p>Chargement des informations de la salle...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!roomData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <p>Aucune information de salle disponible.</p>
        </div>
      </Layout>
    );
  }

  // Check if the game type is related to FutArena using lowercase comparison for safety
  const isFutArena = roomData.game_type?.toLowerCase() === "futarena" || roomData.game_type?.toLowerCase() === "eafc25";

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card className="bg-gradient-to-b from-background to-background/95 border-casino-accent/20">
          <CardHeader className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <CardTitle className="text-2xl text-casino-accent">👋 Règles des matchs</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Veuillez lire et accepter les règles avant de participer
                </p>
              </div>
              <RoomInfo
                currentPlayers={roomData.current_players}
                maxPlayers={roomData.max_players}
                entryFee={roomData.entry_fee}
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {isFutArena && hostData && hostData.users && (
              <section>
                <h3 className="font-semibold text-lg mb-4 text-casino-accent">Informations du créateur</h3>
                <HostInfoCard 
                  hostUsername={hostData.users.username}
                  hostAvatar={hostData.users.avatar_url}
                  platform={roomData.platform || 'ps5' as GamePlatform}
                  psn={hostData.users.psn_username}
                  xboxId={hostData.users.xbox_gamertag}
                  eaId={hostData.users.ea_id || hostData.ea_id}
                />
              </section>
            )}

            <Separator className="bg-casino-accent/20" />

            <section>
              <h3 className="text-lg font-semibold mb-4 text-casino-accent">Configuration du match</h3>
              <GameSettings
                halfLengthMinutes={roomData.half_length_minutes}
                legacyDefendingAllowed={roomData.legacy_defending_allowed}
                customFormationsAllowed={roomData.custom_formations_allowed}
                platform={roomData.platform}
                mode={roomData.mode}
                teamType={roomData.team_type}
              />
            </section>

            <Separator className="bg-casino-accent/20" />

            <PlatformRules />

            <Separator className="bg-casino-accent/20" />

            <DisclaimerSection />

            <div className="pt-4">
              <Button 
                onClick={handleJoinConfirm} 
                className="w-full bg-casino-accent hover:bg-casino-accent/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "J'ai lu les règles et je rejoins la partie"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
