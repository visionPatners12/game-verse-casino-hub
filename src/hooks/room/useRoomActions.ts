import { useCallback } from "react";
import { roomService } from "@/services/room";
import { useToast } from "@/components/ui/use-toast";

export function useRoomActions({
  roomId,
  currentUserId,
  isReady,
  setIsReady,
  setGameStatus,
}: {
  roomId: string | undefined,
  currentUserId: string | null,
  isReady: boolean,
  setIsReady: (v: boolean) => void,
  setGameStatus: (status: 'waiting' | 'starting' | 'playing' | 'ended') => void,
}) {
  const { toast } = useToast();

  const toggleReady = useCallback(async () => {
    if (!roomId || !currentUserId) return;
    const newReadyState = !isReady;
    try {
      await roomService.markPlayerReady(roomId, currentUserId, newReadyState);
      setIsReady(newReadyState);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update ready status. Please try again.",
        variant: "destructive"
      });
    }
  }, [roomId, currentUserId, isReady, setIsReady, toast]);

  const startGame = useCallback(async () => {
    if (!roomId) return;
    try {
      setGameStatus('starting');
      const result = await roomService.startGame(roomId);
      if (result) setGameStatus('playing');
      else setGameStatus('waiting');
    } catch (error) {
      setGameStatus('waiting');
      toast({
        title: "Error",
        description: "Could not start the game. Please try again.",
        variant: "destructive"
      });
    }
  }, [roomId, setGameStatus, toast]);

  const broadcastMove = useCallback((moveData: any) => {
    if (!roomId) return;
    roomService.broadcastMove(roomId, moveData);
  }, [roomId]);

  const endGame = useCallback(async (results: any) => {
    if (!roomId) return;
    try {
      await roomService.endGame(roomId, results);
      setGameStatus('ended');
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not end the game properly. Please try again.",
        variant: "destructive"
      });
    }
  }, [roomId, setGameStatus, toast]);

  const forfeitGame = useCallback(async () => {
    if (!roomId || !currentUserId) return;
    try {
      await roomService.disconnectFromRoom(roomId, currentUserId);
      roomService.saveActiveRoomToStorage("", "", "");
      toast({
        title: "Partie abandonnée",
        description: "Vous avez quitté la partie.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de quitter la partie. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  }, [roomId, currentUserId, toast]);

  return { toggleReady, startGame, broadcastMove, endGame, forfeitGame };
}
