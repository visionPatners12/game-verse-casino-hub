
import { useState } from "react";
import { useParams } from "react-router-dom";
import { RoomData } from "@/components/game/types";
import { useRoomValidation } from "./room/useRoomValidation";
import { usePlayerConnection } from "./room/usePlayerConnection";
import { useRoomData } from "./room/useRoomData";
import { useRoomSubscription } from "./room/useRoomSubscription";

export const useGameRoom = () => {
  const { gameType, roomId } = useParams<{ gameType: string; roomId: string }>();
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  
  useRoomValidation(gameType);
  usePlayerConnection(roomId);
  const { loading, currentUserId } = useRoomData(roomId);
  useRoomSubscription(roomId, setRoomData);

  return {
    loading,
    roomData,
    currentUserId,
    gameType
  };
};
