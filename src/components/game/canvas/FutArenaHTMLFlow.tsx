
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { RoomData } from "../types";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useFutId } from "@/hooks/useFutId";

interface FutArenaHTMLFlowProps {
  roomData: RoomData;
  currentUserId: string | null;
  gameStatus: 'waiting' | 'starting' | 'playing' | 'ended';
  onRefreshRoom: () => void;
}

export const FutArenaHTMLFlow = ({
  roomData,
  currentUserId,
  gameStatus,
  onRefreshRoom,
}: FutArenaHTMLFlowProps) => {
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

  const hostUserId =
    (roomData as any)?.created_by ||
    (roomData?.game_players && roomData?.game_players[0]?.user_id) ||
    null;
  const isHost = currentUserId && hostUserId === currentUserId;

  const me = futPlayers.find((p) => p.user_id === currentUserId);

  const { futId, isLoading: futIdLoading, saveFutId } = useFutId(currentUserId);

  const handleGetReady = async () => {
    if (!currentUserId || !roomData?.id) return;
    if (!futId) {
      toast.error("Veuillez renseigner votre FUT ID avant d'être prêt.");
      return;
    }

    // Mise à jour du statut du joueur côté DB
    const { error: playerError } = await supabase
      .from("game_players")
      .update({ is_ready: true })
      .eq("session_id", roomData.id)
      .eq("user_id", currentUserId);

    if (playerError) {
      toast.error("Erreur lors du passage en prêt.");
      return;
    }

    if (isHost) {
      // Si host, update all players ready et start la partie
      await supabase.from("game_players").update({ is_ready: true }).eq("session_id", roomData.id);
      await supabase
        .from("game_sessions")
        .update({ status: "Active", start_time: new Date().toISOString() })
        .eq("id", roomData.id);
      toast.success("La partie démarre !");
    } else {
      toast.success("Prêt ! Attendez que l'hôte lance la partie…");
    }

    onRefreshRoom();
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
        background: "rgba(30, 29, 51, 0.92)",
        minHeight: 340,
      }}
      className="animate-fade-in"
    >
      {futIdLoading ? (
        <div className="flex flex-col justify-center items-center h-full">
          <Loader2 className="h-10 w-10 animate-spin mb-2" />
          <div>Chargement de votre FUT ID…</div>
        </div>
      ) : (
        <div className="max-w-2xl flex flex-col items-center">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {futPlayers.map((p, idx) => (
              <div
                key={p.user_id}
                className="flex flex-col items-center bg-card/70 rounded-lg px-6 py-4 m-2 shadow"
                style={{ minWidth: 180 }}
              >
                <span className="font-bold text-lg text-primary mb-2">{`Joueur ${idx + 1}`}</span>
                <span className="text-2xl font-semibold text-foreground mb-1">FUT ID :</span>
                <span className="mb-4 text-xl text-muted-foreground">
                  {p.user_id === currentUserId
                    ? futId || <span className="italic text-red-500">Non défini</span>
                    : p.ea_id || <span className="italic text-red-500">Non défini</span>}
                </span>
                {p.is_ready && (
                  <div className="text-green-600 font-semibold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Prêt
                  </div>
                )}
                {p.user_id !== currentUserId && !p.ea_id && (
                  <div className="text-sm text-red-500 italic mt-2">
                    En attente FUT ID…
                  </div>
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
          <div className="mt-8 text-lg font-semibold text-muted-foreground text-center">
            {isHost
              ? "En cliquant sur 'Get Ready', la partie démarre immédiatement pour tous, même si certains ne sont pas prêts."
              : "En attente que l'hôte démarre la partie…"}
          </div>
        </div>
      )}
    </div>
  );
};
