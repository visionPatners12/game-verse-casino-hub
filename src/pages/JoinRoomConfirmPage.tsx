
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useJoinRoom } from "@/hooks/room/useJoinRoom";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { GameSettings } from "@/components/game/join-dialog/GameSettings";
import { PlatformRules } from "@/components/game/join-dialog/PlatformRules";
import { DisclaimerSection } from "@/components/game/join-dialog/DisclaimerSection";
import { HostInfoCard } from "@/components/games/HostInfoCard";
import { RoomInfo } from "@/components/game/join-dialog/RoomInfo";

export default function JoinRoomConfirmPage() {
  const { gameType, roomId } = useParams();
  const navigate = useNavigate();
  const { joinRoom, isLoading } = useJoinRoom();
  const [roomData, setRoomData] = useState<any>(null);
  const [hostData, setHostData] = useState<any>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      try {
        // Vérifier si l'ID est un UUID ou un code de salle
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(roomId);
        
        const query = supabase
          .from('game_sessions')
          .select(`
            *,
            game_players(
              id,
              user_id,
              display_name,
              ea_id,
              users(
                username,
                avatar_url
              )
            ),
            arena_game_sessions(
              platform,
              mode,
              team_type,
              half_length_minutes,
              legacy_defending_allowed,
              custom_formations_allowed
            )
          `);
        
        // Utiliser le champ approprié pour la recherche
        const { data: room, error } = isUuid 
          ? await query.eq('id', roomId).single()
          : await query.eq('room_id', roomId).maybeSingle();

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

        console.log("Room data:", room);

        // Fusionner les données de la session de jeu et de la configuration d'arène
        const mergedRoomData = {
          ...room,
          ...(room.arena_game_sessions && room.arena_game_sessions[0] ? room.arena_game_sessions[0] : {})
        };
        
        setRoomData(mergedRoomData);

        // Récupérer les données du créateur (premier joueur)
        if (room.game_players && room.game_players.length > 0) {
          const creator = room.game_players[0];
          // Fix: Accéder correctement aux données utilisateur
          const creatorData = {
            ...creator,
            username: creator.users?.username || "Joueur inconnu",
            avatar_url: creator.users?.avatar_url || null,
            ea_id: creator.ea_id
          };
          console.log("Creator data:", creatorData);
          setHostData(creatorData);
        }

      } catch (error: any) {
        console.error('Error:', error);
        toast.error("Une erreur s'est produite");
        navigate('/games');
      }
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
            {isFutArena && hostData && (
              <section>
                <h3 className="font-semibold text-lg mb-4 text-casino-accent">Informations du créateur</h3>
                <HostInfoCard 
                  hostUsername={hostData.username}
                  hostAvatar={hostData.avatar_url}
                  gamerTag={hostData.ea_id || "Non spécifié"}
                />
                <p className="text-sm text-muted-foreground mt-2 italic">
                  Pour commencer le match, envoyez une invitation à l'ID EA du créateur
                </p>
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
                J'ai lu les règles et je rejoins la partie
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
