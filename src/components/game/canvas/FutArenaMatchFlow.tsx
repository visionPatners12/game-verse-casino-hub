
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle } from "lucide-react";
import { GameTimer } from "./GameTimer";
import { useFutId } from "@/hooks/useFutId";
import { RoomData } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FutArenaMatchFlowProps {
  roomData: RoomData;
  currentUserId: string | null;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
}

export const FutArenaMatchFlow = ({ roomData, currentUserId, gameStatus }: FutArenaMatchFlowProps) => {
  const connectedPlayers = useMemo(
    () =>
      (roomData?.game_players ?? []).filter(
        p => p.is_connected && !!p.user_id
      ),
    [roomData]
  );

  const futPlayers = connectedPlayers.map((p) => ({
    user_id: p.user_id,
    ea_id: p.ea_id || null,
    display_name: p.display_name,
    is_ready: p.is_ready || false,
  }));

  const me = futPlayers.find(p => p.user_id === currentUserId);

  const { futId, isLoading: futIdLoading, saveFutId } = useFutId(currentUserId);

  const otherPlayer = futPlayers.find(p => p.user_id !== currentUserId);

  const [timerStarted, setTimerStarted] = useState(false);
  
  // Check if all players are ready
  const allPlayersReady = connectedPlayers.length > 0 && 
    connectedPlayers.every(player => player.is_ready);

  useEffect(() => {
    if (!roomData?.id) return;

    const channel = supabase
      .channel(`room-${roomData.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'game_players',
        filter: `session_id=eq.${roomData.id}`
      }, () => {
        // Reload data when any player's status changes
        window.location.reload();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomData?.id]);

  const handleGetReady = async () => {
    if (!currentUserId || !roomData?.id) return;
    if (!futId) {
      toast.error("Please set your FUT ID before getting ready.");
      return;
    }
    const { error } = await supabase
      .from('game_players')
      .update({ is_ready: true })
      .eq('session_id', roomData.id)
      .eq('user_id', currentUserId);
    if (error) {
      toast.error("Couldn't update ready status.");
    } else {
      toast.success("You're ready! Waiting for other players...");
    }
  };

  useEffect(() => {
    // Start timer only when:
    // 1. Game status is playing or starting
    // 2. All connected players are ready
    // 3. Timer hasn't already started
    if (
      (gameStatus === "playing" || gameStatus === "starting") &&
      allPlayersReady &&
      !timerStarted
    ) {
      setTimerStarted(true);
    }
  }, [connectedPlayers, allPlayersReady, timerStarted, gameStatus]);

  if (futIdLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Loader2 className="h-10 w-10 animate-spin mb-2" />
        <div>Chargement de votre FUT ID…</div>
      </div>
    );
  }

  if (!timerStarted) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 z-30">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {futPlayers.map((p, idx) => (
            <div key={p.user_id} className="flex flex-col items-center bg-card/70 rounded-lg px-6 py-4 m-2 shadow">
              <span className="font-bold text-lg text-primary mb-2">{`Joueur ${idx + 1}`}</span>
              <span className="text-2xl font-semibold text-foreground mb-1">FUT ID :</span>
              <span className="mb-4 text-xl text-muted-foreground">{p.user_id === currentUserId ? (futId || <span className="italic text-red-500">Non défini</span>) : (p.ea_id || <span className="italic text-red-500">Non défini</span>)}</span>
              {p.is_ready && (
                <div className="text-green-600 font-semibold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Prêt
                </div>
              )}
              {p.user_id !== currentUserId && !p.ea_id && (
                <div className="text-sm text-red-500 italic mt-2">En attente que ce joueur renseigne son FUT ID…</div>
              )}
            </div>
          ))}
        </div>
        
        {me && !me.is_ready && (
          <Button 
            onClick={handleGetReady}
            className="mt-8"
            size="lg"
            disabled={!futId}
          >
            Get Ready
          </Button>
        )}
        
        <div className="mt-8 text-lg font-semibold text-muted-foreground">
          {!allPlayersReady ? 
            "En attente que tous les joueurs soient prêts et que la partie démarre..." : 
            "Tous les joueurs sont prêts! La partie est en cours de démarrage..."}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-30">
      <div className="flex flex-col items-center animate-fade-in">
        <GameTimer matchDuration={roomData.match_duration!} />
        <p className="mt-6 text-xl text-muted-foreground font-semibold">Match en cours</p>
      </div>
    </div>
  );
};
