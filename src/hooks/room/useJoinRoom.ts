
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isValidGameType, gameCodeToType } from "@/lib/gameTypes";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";

export function useJoinRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { hasSufficientBalance } = useWalletBalanceCheck();

  const joinRoom = async (roomCode: string) => {
    if (roomCode.length !== 6) {
      toast.error("Code de salon invalide. Veuillez entrer un code à 6 caractères.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour rejoindre un salon");
        navigate("/auth");
        return;
      }
      
      // Find the room first to check entry fee
      const { data: room, error: roomError } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('room_id', roomCode.toUpperCase())
        .maybeSingle();
        
      if (roomError && roomError.code !== 'PGRST116') {
        throw roomError;
      }
      
      if (!room) {
        toast.error("Salon introuvable. Veuillez vérifier le code et réessayer.");
        return;
      }

      console.log("Salon trouvé:", room);

      // Check if room is full
      if (room.current_players >= room.max_players) {
        toast.error("Ce salon est complet. Veuillez essayer un autre salon.");
        return;
      }

      // Vérifier le solde du portefeuille est géré dans le handleSubmit du JoinGameDialog
      
      // Check if user profile is complete
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();
        
      if (userError) {
        console.error("Erreur lors de la récupération des données de l'utilisateur:", userError);
        throw userError;
      }
      
      if (!userData || !userData.username) {
        toast.error("Veuillez configurer votre nom d'utilisateur dans votre profil.");
        navigate("/profile");
        return;
      }
      
      // Pour FutArena, récupérer le FUT ID du joueur
      let futId = null;
      if (room.game_type?.toLowerCase() === 'futarena') {
        const { data: futPlayer } = await supabase
          .from('fut_players')
          .select('fut_id')
          .eq('user_id', user.id)
          .maybeSingle();
          
        futId = futPlayer?.fut_id;
        
        if (!futId) {
          console.log("Aucun FUT ID trouvé pour cet utilisateur, demandera plus tard");
        } else {
          console.log("FUT ID trouvé:", futId);
        }
      }
      
      // Check if player is already in the room
      const { data: existingPlayer, error: playerCheckError } = await supabase
        .from('game_players')
        .select('id, is_connected')
        .eq('session_id', room.id)
        .eq('user_id', user.id)
        .maybeSingle();
        
      if (playerCheckError && playerCheckError.code !== 'PGRST116') {
        throw playerCheckError;
      }
      
      if (existingPlayer) {
        console.log("Le joueur existe déjà dans la salle, mise à jour du statut de connexion et du FUT ID si nécessaire");
        // Player already exists, update connection status and potentially FUT ID
        const updateData: any = { is_connected: true };
        
        // Pour FutArena, mettre à jour le ea_id si on a un futId
        if (room.game_type?.toLowerCase() === 'futarena' && futId) {
          updateData.ea_id = futId;
        }
        
        const { error: updateError } = await supabase
          .from('game_players')
          .update(updateData)
          .eq('id', existingPlayer.id);
          
        if (updateError) {
          console.error("Erreur lors de la mise à jour de la connexion du joueur:", updateError);
          throw updateError;
        }
      } else {
        console.log("Ajout d'un nouveau joueur à la salle:", room.id);
        // Add player to the room
        const newPlayerData: any = {
          session_id: room.id,
          display_name: userData.username,
          user_id: user.id,
          is_connected: true,
          is_ready: false
        };
        
        // Pour FutArena, ajouter le ea_id si on a un futId
        if (room.game_type?.toLowerCase() === 'futarena' && futId) {
          newPlayerData.ea_id = futId;
        }
        
        const { data: newPlayer, error: joinError } = await supabase
          .from('game_players')
          .insert(newPlayerData)
          .select();
          
        if (joinError) {
          console.error("Erreur lors de l'ajout du joueur à la salle:", joinError);
          toast.error("Erreur lors de l'ajout du joueur à la salle: " + joinError.message);
          throw joinError;
        }
        
        console.log("Joueur ajouté avec succès à la salle:", newPlayer);
      }
      
      // Find game type for navigation
      const gameType = typeof room.game_type === 'string' 
        ? room.game_type.toLowerCase() 
        : String(room.game_type).toLowerCase();
        
      if (!isValidGameType(gameType)) {
        toast.error("Type de jeu invalide. Veuillez contacter le support.");
        return;
      }
      
      // Navigate to game room
      console.log(`Navigation vers /games/${gameType}/room/${room.id}`);
      navigate(`/games/${gameType}/room/${room.id}`);
      toast.success("Vous avez rejoint le salon avec succès !");
      
    } catch (error: any) {
      console.error("Erreur lors de la tentative de rejoindre le salon:", error);
      toast.error(error.message || "Échec de l'accès au salon. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    joinRoom,
    isLoading
  };
}
