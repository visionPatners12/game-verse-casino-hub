
import { useEffect } from "react";
import { roomService } from "@/services/room";
import { PresenceData } from "@/components/game/types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useRoomSocketEvents({
  roomId,
  currentUserId,
  fetchRoomData,
  setGameStatus,
  setIsReady,
  setPresenceState
}: {
  roomId: string | undefined,
  currentUserId: string | null,
  fetchRoomData: () => Promise<void>,
  setGameStatus: (status: 'waiting' | 'starting' | 'playing' | 'ended') => void,
  setIsReady: (r: boolean) => void,
  setPresenceState: (p: Record<string, PresenceData[]>) => void
}) {
  const { toast: uiToast } = useToast();

  useEffect(() => {
    // Don't continue if we don't have both roomId and currentUserId
    if (!roomId || !currentUserId) return;

    console.log(`Initializing room socket connection for room ${roomId} and user ${currentUserId}`);
    
    // First connect to room
    const channel = roomService.connectToRoom(roomId, currentUserId);
    if (!channel) {
      console.error("Failed to create room channel");
      return;
    }
    
    // Set up event handlers for room events
    const handlePresenceSync = (_: string, state: Record<string, PresenceData[]>) => {
      console.log("Presence sync received:", state);
      setPresenceState(state);
      
      // Update ready status from presence data
      const flat = Object.values(state).flat();
      const current = flat.find(p => p.user_id === currentUserId);
      if (current) {
        setIsReady(Boolean(current.is_ready));
      }
    };
    
    const handlePlayerJoined = () => {
      console.log("Player joined event received");
      fetchRoomData();
    };
    
    const handlePlayerLeft = async () => {
      console.log("Player left event received");
      // Check if the player forfeited
      const { data: players } = await supabase
        .from('game_players')
        .select('user_id, has_forfeited')
        .eq('session_id', roomId);
      
      if (players?.some(p => p.has_forfeited)) {
        uiToast({
          title: "Un joueur a abandonné",
          description: "Un joueur a quitté la partie.",
        });
      }
      fetchRoomData();
    };
    
    const handleGameStart = (_: string, data: any) => {
      console.log("Game start event received:", data);
      
      // First mark as "starting" to show loading UI
      setGameStatus('starting');
      
      // Update to "playing" after scripts have time to initialize
      setTimeout(() => {
        setGameStatus('playing');
        fetchRoomData();
        toast.success("La partie a démarré !");
      }, 1000);
    };
    
    const handleGameOver = (_: string, data: any) => {
      console.log("Game over event received:", data);
      setGameStatus('ended');
      fetchRoomData();
    };

    // Nouveau gestionnaire pour la mise à jour des données de joueur
    const handlePlayerUpdated = () => {
      console.log("Player data updated event received");
      fetchRoomData();
    };

    // Monitor room status changes in the database
    const roomStatusChannel = supabase
      .channel(`room-status-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "game_sessions",
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          console.log("Room status changed in DB:", payload.new);
          if (payload.new && payload.new.status === "Active") {
            console.log("Setting game status to starting based on DB update");
            
            // First mark as "starting" to show loading UI
            setGameStatus('starting');
            
            // Switch to playing after a short delay
            setTimeout(() => {
              console.log("Transitioning from starting to playing");
              setGameStatus('playing');
              toast.success("La partie a démarré !");
              fetchRoomData();
            }, 1000);
          }
        }
      )
      .subscribe();

    // Surveiller les modifications des game_players
    const playersChannel = supabase
      .channel(`players-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Toutes les opérations (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "game_players",
          filter: `session_id=eq.${roomId}`,
        },
        (payload) => {
          console.log("Players data changed in DB:", payload);
          fetchRoomData(); // Rafraîchir les données pour tous les joueurs
        }
      )
      .subscribe();

    // Register all event handlers
    roomService.onEvent('presenceSync', handlePresenceSync);
    roomService.onEvent('playerJoined', handlePlayerJoined);
    roomService.onEvent('playerLeft', handlePlayerLeft);
    roomService.onEvent('gameStart', handleGameStart);
    roomService.onEvent('gameOver', handleGameOver);
    roomService.onEvent('playerUpdated', handlePlayerUpdated);

    // Fetch initial room data
    fetchRoomData();

    // Clean up function to run when component unmounts or dependencies change
    return () => {
      console.log(`Cleaning up room socket connection for room ${roomId}`);
      
      // Remove all event handlers
      roomService.offEvent('presenceSync', handlePresenceSync);
      roomService.offEvent('playerJoined', handlePlayerJoined);
      roomService.offEvent('playerLeft', handlePlayerLeft);
      roomService.offEvent('gameStart', handleGameStart);
      roomService.offEvent('gameOver', handleGameOver);
      roomService.offEvent('playerUpdated', handlePlayerUpdated);
      
      // Clean up the room status channel
      supabase.removeChannel(roomStatusChannel);
      supabase.removeChannel(playersChannel);
      
      // Only disconnect if we have both room and user ID
      if (roomId && currentUserId) {
        // When unmounting component, disconnect from room
        roomService.disconnectFromRoom(roomId, currentUserId);
      }
    };
  }, [roomId, currentUserId, fetchRoomData, setGameStatus, setIsReady, setPresenceState, uiToast]);
}
