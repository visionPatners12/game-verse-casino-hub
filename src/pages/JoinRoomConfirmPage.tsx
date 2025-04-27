
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
import { GamePlatform, GameMode, TeamType } from "@/types/futarena";

export default function JoinRoomConfirmPage() {
  const { gameType, roomId } = useParams();
  const navigate = useNavigate();
  const { joinRoom, isLoading } = useJoinRoom();
  const [roomData, setRoomData] = useState<any>(null);
  const [hostData, setHostData] = useState<any>(null);
  const [gameSettings, setGameSettings] = useState<{
    halfLengthMinutes: number;
    legacyDefendingAllowed: boolean;
    customFormationsAllowed: boolean;
    platform: GamePlatform;
    mode: GameMode;
    teamType: TeamType;
  } | null>(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      try {
        console.log("Fetching room data for:", roomId);
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
            arena_game_sessions!inner(
              platform,
              mode,
              team_type,
              half_length_minutes,
              legacy_defending_allowed,
              custom_formations_allowed
            )
          `);
        
        let roomResult;
        
        // Utiliser le champ approprié pour la recherche
        if (isUuid) {
          console.log("Searching by id (UUID)");
          roomResult = await query.eq('id', roomId);
        } else {
          console.log("Searching by room_id (short code)");
          roomResult = await query.eq('room_id', roomId);
        }
        
        const { data: rooms, error } = roomResult;

        if (error) {
          console.error('Error fetching room data:', error);
          toast.error("Erreur lors de la récupération des données de la salle");
          navigate('/games');
          return;
        }

        if (!rooms || rooms.length === 0) {
          toast.error("Salon introuvable");
          navigate('/games');
          return;
        }

        const room = rooms[0];
        console.log("Room data retrieved:", room);

        // S'assurer que nous avons les données d'arena
        if (!room.arena_game_sessions || room.arena_game_sessions.length === 0) {
          console.error("No arena game session data found");
          toast.error("Configuration de jeu invalide");
          navigate('/games');
          return;
        }

        // Extraire les données de configuration de l'arène
        const arenaConfig = room.arena_game_sessions[0];
        console.log("Arena configuration:", arenaConfig);
        
        // Configurer les paramètres du jeu
        setGameSettings({
          halfLengthMinutes: arenaConfig.half_length_minutes || 12,
          legacyDefendingAllowed: arenaConfig.legacy_defending_allowed || false,
          customFormationsAllowed: arenaConfig.custom_formations_allowed || false,
          platform: arenaConfig.platform as GamePlatform || 'ps5',
          mode: arenaConfig.mode as GameMode || 'online_friendlies',
          teamType: arenaConfig.team_type as TeamType || 'any_teams'
        });
        
        // Fusionner les données de la session de jeu et de la configuration d'arène
        const mergedRoomData = {
          ...room,
          ...arenaConfig
        };
        
        console.log("Merged room data:", mergedRoomData);
        console.log("Game settings:", gameSettings);
        setRoomData(mergedRoomData);

        // Récupérer les données du créateur (premier joueur)
        if (room.game_players && room.game_players.length > 0) {
          const creator = room.game_players[0];
          // Accéder correctement aux données utilisateur
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
              {gameSettings && (
                <GameSettings
                  halfLengthMinutes={gameSettings.halfLengthMinutes}
                  legacyDefendingAllowed={gameSettings.legacyDefendingAllowed}
                  customFormationsAllowed={gameSettings.customFormationsAllowed}
                  platform={gameSettings.platform}
                  mode={gameSettings.mode}
                  teamType={gameSettings.teamType}
                />
              )}
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
