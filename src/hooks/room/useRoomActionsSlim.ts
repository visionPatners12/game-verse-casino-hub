
import { useCallback } from "react";
import { roomService } from "@/services/room";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useWalletCheck } from "./useWalletCheck";

/**
 * A slimmer version of room actions that focuses on specific room functionality
 */
export function useRoomActionsSlim(
  roomId: string | undefined, 
  currentUserId: string | null
) {
  const navigate = useNavigate();
  const { hasSufficientBalance } = useWalletCheck();

  /**
   * Toggle the ready status of the current player
   */
  const toggleReady = useCallback(async (isReady: boolean, setIsReady: (isReady: boolean) => void) => {
    if (!roomId || !currentUserId) return;

    try {
      const newReadyState = !isReady;
      await roomService.markPlayerReady(roomId, currentUserId, newReadyState);
      setIsReady(newReadyState);
    } catch (error) {
      console.error("Failed to toggle ready state:", error);
      toast.error("Failed to update ready status. Please try again.");
    }
  }, [roomId, currentUserId]);

  /**
   * Start the game
   */
  const startGame = useCallback(async (setGameStatus: (status: 'waiting' | 'starting' | 'playing' | 'ended') => void) => {
    if (!roomId) return;

    try {
      await roomService.startGame(roomId);
      setGameStatus('starting');
    } catch (error) {
      console.error("Failed to start game:", error);
      toast.error("Failed to start the game. Please try again.");
    }
  }, [roomId]);

  /**
   * Leave the current game (forfeit)
   */
  const forfeitGame = useCallback(async (setGameStatus: (status: 'waiting' | 'starting' | 'playing' | 'ended') => void) => {
    if (!roomId || !currentUserId) return;

    try {
      console.log(`Player ${currentUserId} is forfeiting game in room ${roomId}`);
      
      // IMPORTANT: Effacer ces données AVANT toutes les autres opérations
      // Cela empêche les tentatives de reconnexion automatiques
      console.log("Clearing client storage...");
      roomService.saveActiveRoomToStorage("", "", "");
      sessionStorage.removeItem('activeRoomId');
      sessionStorage.removeItem('activeUserId');
      sessionStorage.removeItem('activeGameType');
      localStorage.removeItem('activeRoomId'); // Vérifier aussi le localStorage au cas où
      localStorage.removeItem('activeUserId');
      localStorage.removeItem('activeGameType');
      console.log("Client storage cleared successfully");
      
      // Mettre à jour le champ active_room_id de l'utilisateur en priorité
      console.log(`Clearing active_room_id for user ${currentUserId}`);
      const { error: userError } = await supabase
        .from('users')
        .update({ active_room_id: null })
        .eq('id', currentUserId);
      
      if (userError) {
        console.error("Failed to clear active room ID:", userError);
        // On continue même en cas d'erreur
      } else {
        console.log("Active room ID cleared successfully in database");
      }
      
      // Marquer le joueur comme ayant abandonné
      console.log(`Marking player ${currentUserId} as forfeited in room ${roomId}`);
      const { error } = await supabase
        .from('game_players')
        .update({ 
          has_forfeited: true, 
          is_connected: false 
        })
        .eq('session_id', roomId)
        .eq('user_id', currentUserId);
        
      if (error) {
        console.error("Failed to forfeit game:", error);
        toast.error("Échec lors de l'abandon de la partie. Veuillez réessayer.");
      } else {
        console.log("Player marked as forfeited in database");
      }
      
      // Déconnecter du canal de la salle
      try {
        console.log(`Disconnecting from room channel for room ${roomId}`);
        await roomService.disconnectFromRoom(roomId, currentUserId);
        console.log("Successfully disconnected from room channel");
      } catch (disconnectError) {
        console.error("Error during room disconnection:", disconnectError);
        // On continue même si la déconnexion échoue
      }
      
      // Mettre à jour l'état du jeu
      setGameStatus('ended');
      
      // Rediriger vers la page des jeux avec un délai pour s'assurer que tout est bien traité
      console.log("Preparing to navigate to games page");
      toast.success("Vous avez quitté la partie");
      
      // Redirection immédiate vers /games
      navigate('/games');
    } catch (error) {
      console.error("Failed to forfeit game:", error);
      toast.error("Échec lors de l'abandon de la partie. Veuillez réessayer.");
      
      // En cas d'erreur critique, forcer la navigation tout de même
      navigate('/games');
    }
  }, [roomId, currentUserId, navigate]);

  return {
    toggleReady,
    startGame,
    forfeitGame,
    hasSufficientBalance
  };
}
