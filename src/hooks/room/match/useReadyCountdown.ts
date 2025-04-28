
import { useState, useEffect } from "react";
import { RoomData } from "@/components/game/types";
import { toast } from "sonner";

export function useReadyCountdown(roomData: RoomData | null) {
  const [readyCountdownActive, setReadyCountdownActive] = useState(false);
  const [readyCountdownEndTime, setReadyCountdownEndTime] = useState<Date | null>(null);

  useEffect(() => {
    if (roomData && roomData.game_players) {
      const readyPlayers = roomData.game_players.filter(player => player.is_ready);
      const connectedPlayers = roomData.game_players.filter(player => player.is_connected);
      
      if (readyPlayers.length === 1 && connectedPlayers.length >= 2 && !readyCountdownActive) {
        const endTime = new Date();
        endTime.setMinutes(endTime.getMinutes() + 5);
        setReadyCountdownEndTime(endTime);
        setReadyCountdownActive(true);
        
        toast.info("Waiting for all players to get ready. 5 minute countdown started.", {
          duration: 5000,
        });
      }
      
      if (readyPlayers.length === connectedPlayers.length && connectedPlayers.length >= 2) {
        setReadyCountdownActive(false);
      }
    }
  }, [roomData, readyCountdownActive]);

  return {
    readyCountdownActive,
    readyCountdownEndTime,
  };
}
