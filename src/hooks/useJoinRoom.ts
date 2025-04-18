
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GameCode, isValidGameType } from "@/lib/gameTypes";

export const useJoinRoom = (roomCode: string, onSuccess: () => void) => {
  const [currentPlayers, setCurrentPlayers] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: room, isLoading } = useQuery({
    queryKey: ['game-session', roomCode],
    queryFn: async () => {
      if (roomCode.length !== 6) return null;
      
      try {
        const { data, error } = await supabase
          .from('game_sessions')
          .select(`
            *,
            game_players:game_players(
              id,
              display_name,
              user_id,
              current_score,
              is_connected,
              users:user_id(username, avatar_url)
            )
          `)
          .eq('room_id', roomCode)
          .maybeSingle(); // Utilisation de maybeSingle() au lieu de single()
          
        if (error) {
          console.error("Room fetch error:", error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de trouver cette salle de jeu"
          });
          throw error;
        }
        
        if (!data) {
          toast({
            variant: "destructive",
            title: "Salle introuvable",
            description: "Veuillez vérifier le code de la salle et réessayer."
          });
          return null;
        }
        
        // Log the user data to ensure it's being properly fetched
        console.log("Room data with user details:", data);
        return data;
      } catch (error) {
        console.error("Room fetch error:", error);
        return null;
      }
    },
    enabled: roomCode.length === 6,
    retry: false
  });

  const handleJoin = async () => {
    if (!room) {
      toast({
        variant: "destructive",
        title: "Salle introuvable",
        description: "Veuillez vérifier le code de la salle et réessayer."
      });
      return;
    }
    
    if (room.current_players >= room.max_players) {
      toast({
        variant: "destructive",
        title: "Salle complète",
        description: "Veuillez essayer une autre salle."
      });
      return;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentification requise",
          description: "Veuillez vous connecter pour rejoindre une salle de jeu."
        });
        return;
      }
      
      // Vérification du profil utilisateur avant de continuer
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username, avatar_url')
        .eq('id', user.id)
        .maybeSingle();
      
      if (userError) {
        console.error("User profile fetch error:", userError);
        toast({
          variant: "destructive",
          title: "Erreur de profil",
          description: "Impossible de récupérer votre profil."
        });
        return;
      }
      
      if (!userData || !userData.username) {
        toast({
          variant: "destructive",
          title: "Profil incomplet",
          description: "Veuillez configurer votre nom d'utilisateur dans votre profil.",
        });
        
        // Rediriger vers la page de profil
        navigate('/profile');
        return;
      }

      // Update user connection status
      await supabase
        .from('users')
        .update({ is_connected: true })
        .eq('id', user.id);
      
      // Check if player already exists in this room
      const { data: existingPlayer, error: checkError } = await supabase
        .from('game_players')
        .select('id, is_connected')
        .eq('session_id', room.id)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Check player error:", checkError);
        toast({
          variant: "destructive",
          title: "Erreur de vérification",
          description: "Impossible de vérifier votre statut dans cette salle."
        });
        return;
      }
      
      if (existingPlayer) {
        // Player exists, just update connection status if needed
        if (!existingPlayer.is_connected) {
          await supabase
            .from('game_players')
            .update({ is_connected: true })
            .eq('id', existingPlayer.id);
        }
        console.log("User already in room, navigating...");
      } else {
        // Player doesn't exist, insert new record
        const { error: joinError } = await supabase
          .from('game_players')
          .insert({
            session_id: room.id,
            display_name: userData.username,
            user_id: user.id,
            is_connected: true
          });
          
        if (joinError) {
          console.error("Error joining room:", joinError);
          toast({
            variant: "destructive",
            title: "Erreur d'inscription",
            description: "Impossible de vous ajouter à cette salle."
          });
          return;
        }
      }
      
      const gameType = typeof room.game_type === 'string' 
        ? room.game_type.toLowerCase()
        : String(room.game_type).toLowerCase();
      
      if (!isValidGameType(gameType)) {
        console.error("Invalid game type:", gameType, "Room data:", room);
        toast({
          variant: "destructive",
          title: "Type de jeu invalide",
          description: "Ce type de jeu n'est pas pris en charge."
        });
        return;
      }
      
      navigate(`/games/${gameType}/room/${room.id}`);
      onSuccess();
    } catch (error) {
      console.error("Join error:", error);
      toast({
        variant: "destructive",
        title: "Échec de l'inscription",
        description: "Veuillez réessayer plus tard."
      });
    }
  };

  return {
    room,
    isLoading,
    currentPlayers,
    setCurrentPlayers,
    handleJoin
  };
};
