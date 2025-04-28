
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
    gamerTag?: string;
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
                avatar_url,
                psn_username,
                xbox_gamertag,
                ea_id
              )
            ),
            arena_game_sessions(
              platform,
              mode,
              team_type,
              half_length_minutes,
              legacy_defending_allowed,
              custom_formations_allowed,
              gamer_tag_1
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
        setRoomData(room);
        
        // Correction: arena_game_sessions est un tableau d'objets dans la réponse
        const arenaConfig = room.arena_game_sessions?.[0];
        console.log("Arena configuration:", arenaConfig);
        
        if (arenaConfig) {
          setGameSettings({
            halfLengthMinutes: arenaConfig.half_length_minutes || 12,
            legacyDefendingAllowed: arenaConfig.legacy_defending_allowed || false,
            customFormationsAllowed: arenaConfig.custom_formations_allowed || false,
            platform: arenaConfig.platform || 'ps5',
            mode: arenaConfig.mode || 'online_friendlies',
            teamType: arenaConfig.team_type || 'any_teams',
            gamerTag: arenaConfig.gamer_tag_1 || null
          });
        }
        
        // Récupérer les données du créateur (premier joueur)
        if (room.game_players && room.game_players.length > 0) {
          const creator = room.game_players[0];
          
          // Accéder aux données utilisateur si disponibles
          const userData = creator.users;
          
          // Déterminer le type de gamer tag à afficher en fonction de la plateforme
          let gamerTag = creator.ea_id || (userData?.ea_id) || "Non spécifié";
          let gamerTagType = "EA ID";
          
          if (arenaConfig && arenaConfig.platform === 'ps5' && userData?.psn_username) {
            gamerTag = userData.psn_username;
            gamerTagType = "PSN Username";
          } else if (arenaConfig && arenaConfig.platform === 'xbox_series' && userData?.xbox_gamertag) {
            gamerTag = userData.xbox_gamertag;
            gamerTagType = "Xbox Gamertag";
          } else if (userData?.ea_id) {
            gamerTag = userData.ea_id;
          }
          
          const creatorData = {
            ...creator,
            username: userData?.username || creator.display_name || "Joueur inconnu",
            avatar_url: userData?.avatar_url || null,
            gamer_tag: gamerTag,
            gamer_tag_type: gamerTagType
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
                  gamerTag={hostData.gamer_tag}
                  gamerTagType={hostData.gamer_tag_type}
                />
                <p className="text-sm text-muted-foreground mt-2 italic">
                  Pour commencer le match, envoyez une invitation à l'ID {hostData.gamer_tag_type} du créateur
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
                  gamerTag={gameSettings.gamerTag}
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
