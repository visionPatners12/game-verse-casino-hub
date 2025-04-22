
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
  // Récupérer les joueurs connectés
  const connectedPlayers = useMemo(
    () =>
      (roomData?.game_players ?? []).filter(
        p => p.is_connected && !!p.user_id
      ),
    [roomData]
  );

  // Pour chaque joueur connecté : id et futId (ea_id dans le player pour l'autre, hook pour moi)
  const futPlayers = connectedPlayers.map((p) => ({
    user_id: p.user_id,
    ea_id: p.ea_id || null,
    display_name: p.display_name,
    is_ready: p.is_ready || false,
  }));

  // Le joueur courant
  const me = futPlayers.find(p => p.user_id === currentUserId);

  // On gère le FUT ID du joueur courant avec le hook (si il en a pas encore, pour pouvoir le mettre à jour live)
  const { futId, isLoading: futIdLoading, saveFutId } = useFutId(currentUserId);
  
  // Pour l'autre joueur, on prend son ea_id direct
  const otherPlayer = futPlayers.find(p => p.user_id !== currentUserId);

  // Gestion du timer
  const [timerStarted, setTimerStarted] = useState(false);

  // Set up real-time subscription to track player ready status changes
  useEffect(() => {
    if (!roomData?.id) return;
    
    const channel = supabase
      .channel(`room-${roomData.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_players',
          filter: `session_id=eq.${roomData.id}`
        },
        (payload) => {
          console.log('Player data updated:', payload);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomData?.id]);
  
  // Handle Get Ready button click
  const handleGetReady = async () => {
    if (!currentUserId || !roomData?.id) return;
    
    try {
      const { error } = await supabase
        .from('game_players')
        .update({ is_ready: true })
        .eq('session_id', roomData.id)
        .eq('user_id', currentUserId);
        
      if (error) {
        console.error("Error updating ready status:", error);
        toast.error("Couldn't update ready status. Please try again.");
      } else {
        toast.success("You're ready! Waiting for other players...");
      }
    } catch (err) {
      console.error("Error in ready status update:", err);
      toast.error("An error occurred. Please try again.");
    }
  };

  // Démarrage du timer quand tout le monde est ready et que le jeu est en mode "playing"
  useEffect(() => {
    if (
      gameStatus === "playing" &&
      connectedPlayers.every(p => p.is_ready) &&
      !timerStarted
    ) {
      setTimerStarted(true);
    }
  }, [connectedPlayers, timerStarted, gameStatus]);

  // Pendant loading
  if (futIdLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <Loader2 className="h-10 w-10 animate-spin mb-2" />
        <div>Chargement de votre FUT ID…</div>
      </div>
    );
  }

  // Display waiting FUT IDs + bouton Play quand les deux joueurs sont là
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
              
              {/* Si autre joueur et FID manquant : afficher message */}
              {p.user_id !== currentUserId && !p.ea_id && (
                <div className="text-sm text-red-500 italic mt-2">En attente que ce joueur renseigne son FUT ID…</div>
              )}
            </div>
          ))}
        </div>
        
        {/* Only display Get Ready button if user isn't ready yet */}
        {me && !me.is_ready && (
          <Button 
            onClick={handleGetReady}
            className="mt-8"
            size="lg"
            disabled={!futId} // Disable if user doesn't have a FUT ID
          >
            Get Ready
          </Button>
        )}
        
        <div className="mt-8 text-lg font-semibold text-muted-foreground">
          {gameStatus === "waiting" ? 
            "En attente que tous les joueurs soient prêts et que la partie démarre..." : 
            "La partie est en cours de démarrage..."}
        </div>
      </div>
    );
  }

  // Timer lancé après que tout le monde ait cliqué "Get Ready" et que le jeu est démarré
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-30">
      <div className="flex flex-col items-center animate-fade-in">
        <GameTimer matchDuration={roomData.match_duration!} />
        <p className="mt-6 text-xl text-muted-foreground font-semibold">Match en cours</p>
      </div>
    </div>
  );
};
