
import { useEffect, useState } from "react";
import { roomService } from "@/services/room";
import { PresenceData } from "@/components/game/types";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  useEffect(() => {
    if (!roomId || !currentUserId) return;

    roomService.connectToRoom(roomId, currentUserId);

    const handlePresenceSync = (_: string, state: Record<string, PresenceData[]>) => {
      setPresenceState(state);
      const flat = Object.values(state).flat();
      const current = flat.find(p => p.user_id === currentUserId);
      setIsReady(Boolean(current && current.is_ready));
    };
    const handlePlayerJoined = () => fetchRoomData();
    const handlePlayerLeft = () => fetchRoomData();
    const handleGameStart = (_: string, data: any) => {
      setGameStatus('playing');
      fetchRoomData();
    };
    const handleGameOver = (_: string, data: any) => {
      setGameStatus('ended');
      fetchRoomData();
    };

    roomService.onEvent('presenceSync', handlePresenceSync);
    roomService.onEvent('playerJoined', handlePlayerJoined);
    roomService.onEvent('playerLeft', handlePlayerLeft);
    roomService.onEvent('gameStart', handleGameStart);
    roomService.onEvent('gameOver', handleGameOver);

    fetchRoomData();

    return () => {
      if (roomId && currentUserId) {
        roomService.disconnectFromRoom(roomId, currentUserId);
      }
      roomService.offEvent('presenceSync', handlePresenceSync);
      roomService.offEvent('playerJoined', handlePlayerJoined);
      roomService.offEvent('playerLeft', handlePlayerLeft);
      roomService.offEvent('gameStart', handleGameStart);
      roomService.offEvent('gameOver', handleGameOver);
    };
    // eslint-disable-next-line
  }, [roomId, currentUserId, fetchRoomData]);
}
