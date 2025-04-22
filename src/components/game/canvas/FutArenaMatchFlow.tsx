
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

export const FutArenaMatchFlow = ({
  roomData,
  currentUserId,
  gameStatus,
}: FutArenaMatchFlowProps) => {
  const connectedPlayers = useMemo(
    () =>
      (roomData?.game_players ?? []).filter(
        (p) => p.is_connected && !!p.user_id
      ),
    [roomData]
  );

  const futPlayers = connectedPlayers.map((p) => ({
    user_id: p.user_id,
    ea_id: p.ea_id || null,
    display_name: p.display_name,
    is_ready: p.is_ready || false,
  }));

  const me = futPlayers.find((p) => p.user_id === currentUserId);

  const { futId, isLoading: futIdLoading, saveFutId } = useFutId(currentUserId);

  const [timerStarted, setTimerStarted] = useState(false);

  // (Simplicité : on considère le host comme étant le premier player du tableau si pas de roomData.created_by)
  // S'il existe un champ "created_by" ou autre, utilisez-le ici :
  const hostUserId =
    (roomData as any)?.created_by ||
    (roomData?.game_players && roomData?.game_players[0]?.user_id) ||
    null;
  const isHost = currentUserId && hostUserId === currentUserId;

  // Pour l'UI actuelle :
  const allPlayersReady =
    connectedPlayers.length > 0 &&
    connectedPlayers.every((player) => player.is_ready);

  useEffect(() => {
    if (!roomData?.id) return;

    const channel = supabase
      .channel(`room-${roomData.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "game_players",
          filter: `session_id=eq.${roomData.id}`,
        },
        () => {
          window.location.reload();
        }
      )
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

    if (isHost) {
      // Host : ready pour tout le monde + status starting
      const { error: updatePlayersErr } = await supabase
        .from("game_players")
        .update({ is_ready: true })
        .eq("session_id", roomData.id);

      const { error: updateStatusErr } = await supabase
        .from("game_sessions")
        .update({ status: "Active", start_time: new Date().toISOString() })
        .eq("id", roomData.id);

      if (updatePlayersErr || updateStatusErr) {
        toast.error("Couldn't start the game for all players.");
      } else {
        toast.success("Partie démarrée par le créateur !");
      }
    } else {
      // Joueur classique : comme avant, ready lui-même
      const { error } = await supabase
        .from("game_players")
        .update({ is_ready: true })
        .eq("session_id", roomData.id)
        .eq("user_id", currentUserId);
      if (error) {
        toast.error("Couldn't update ready status.");
      } else {
        toast.success("You're ready! Waiting for host to start the game...");
      }
    }
  };

  useEffect(() => {
    // Start timer si partie a commencé OU si tous les joueurs sont ready
    if (
      (gameStatus === "playing" || gameStatus === "starting" || allPlayersReady) &&
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

        {/* Host ou non, bouton "Get Ready" */}
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
          {!timerStarted
            ? isHost
              ? "En cliquant sur 'Get Ready', vous lancez la partie pour tous les joueurs."
              : "En attente que le créateur démarre la partie…"
            : "Tous les joueurs sont prêts ! La partie est en cours de démarrage..."}
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
