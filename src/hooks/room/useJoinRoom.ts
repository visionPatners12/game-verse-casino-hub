
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isValidGameType } from "@/lib/gameTypes";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";

export function useJoinRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { checkBalance } = useWalletBalanceCheck();

  const joinRoom = async (roomCode: string, onOpenChange?: (open: boolean) => void) => {
    if (roomCode.length !== 6) {
      toast.error("Code de salon invalide. Veuillez entrer un code à 6 caractères.");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Vous devez être connecté pour rejoindre un salon");
        navigate("/auth");
        return;
      }
      
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

      if (room.current_players >= room.max_players) {
        toast.error("Ce salon est complet. Veuillez essayer un autre salon.");
        return;
      }
      
      if (room.entry_fee > 0) {
        const hasEnoughBalance = await checkBalance(room.entry_fee);
        if (!hasEnoughBalance) {
          if (onOpenChange) {
            onOpenChange(false);
          }
          return;
        }
      }
      
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
        const updateData: any = { is_connected: true };
        
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

        console.log(`Setting active_room_id=${room.id} for user ${user.id} explicitly`);
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ active_room_id: room.id })
          .eq('id', user.id);
          
        if (userUpdateError) {
          console.error("Erreur lors de la mise à jour de l'active_room_id:", userUpdateError);
        } else {
          console.log(`Successfully updated active_room_id to ${room.id} for user ${user.id}`);
        }
      } else {
        console.log("Ajout d'un nouveau joueur à la salle:", room.id);
        const newPlayerData: any = {
          session_id: room.id,
          display_name: userData.username,
          user_id: user.id,
          is_connected: true,
          is_ready: false
        };
        
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

        console.log(`Setting active_room_id=${room.id} for user ${user.id} explicitly`);
        const { error: userUpdateError } = await supabase
          .from('users')
          .update({ active_room_id: room.id })
          .eq('id', user.id);
          
        if (userUpdateError) {
          console.error("Erreur lors de la mise à jour de l'active_room_id:", userUpdateError);
        } else {
          console.log(`Successfully updated active_room_id to ${room.id} for user ${user.id}`);
        }
        
        console.log("Joueur ajouté avec succès à la salle:", newPlayer);
      }
      
      const gameType = typeof room.game_type === 'string' 
        ? room.game_type.toLowerCase() 
        : String(room.game_type).toLowerCase();
        
      if (!isValidGameType(gameType)) {
        toast.error("Type de jeu invalide. Veuillez contacter le support.");
        return;
      }
      
      if (onOpenChange) {
        onOpenChange(false);
      }
      
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
