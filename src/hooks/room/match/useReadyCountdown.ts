
import { useState, useEffect } from "react";
import { RoomData } from "@/components/game/types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useReadyCountdown(roomData: RoomData | null) {
  const [readyCountdownActive, setReadyCountdownActive] = useState(false);
  const [readyCountdownEndTime, setReadyCountdownEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!roomData) return;
    
    const checkReadyStatus = () => {
      if (!roomData || !roomData.game_players) return;
      
      const readyPlayers = roomData.game_players.filter(player => player.is_ready);
      const connectedPlayers = roomData.game_players.filter(player => player.is_connected);
      
      // Start countdown when at least one player is ready and there are multiple players connected
      if (readyPlayers.length >= 1 && connectedPlayers.length >= 2 && !readyCountdownActive) {
        console.log("Starting ready countdown - 1+ player ready and 2+ connected");
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + 5); // 5 minute countdown
        setReadyCountdownEndTime(endTime);
        setReadyCountdownActive(true);
        
        toast.info("Waiting for all players to get ready. 5 minute countdown started.", {
          duration: 5000,
        });
      }
      
      // Stop countdown when all connected players are ready
      if (readyPlayers.length === connectedPlayers.length && connectedPlayers.length >= 2) {
        console.log("All players ready, stopping countdown");
        setReadyCountdownActive(false);
        
        // If all players are ready, we could start the game automatically
        // or show a toast to indicate that the game can start
        if (readyPlayers.length >= 2) {
          toast.success("All players are ready! The game can now start.", {
            duration: 3000,
          });
        }
      }
    };
    
    // Check ready status whenever room data changes
    checkReadyStatus();
    
    // Also set up a listener for real-time updates to player readiness
    const channel = supabase
      .channel(`player-ready-status-${roomData.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'game_players',
        filter: `session_id=eq.${roomData.id}`,
      }, payload => {
        // When a player's ready status changes, check if we need to start/stop countdown
        if (payload.new && payload.old && payload.new.is_ready !== payload.old.is_ready) {
          console.log(`Player ${payload.new.user_id} ready status changed to ${payload.new.is_ready}`);
          checkReadyStatus();
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomData, readyCountdownActive]);

  return {
    readyCountdownActive,
    readyCountdownEndTime,
  };
}
