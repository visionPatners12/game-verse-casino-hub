
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useJoinRoom } from "@/hooks/useJoinRoom";
import { RoomPlayersList } from "./RoomPlayersList";

interface JoinGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JoinGameDialog = ({ open, onOpenChange }: JoinGameDialogProps) => {
  const [roomCode, setRoomCode] = useState("");
  const { room, isLoading, currentPlayers, setCurrentPlayers, handleJoin } = useJoinRoom(roomCode, () => onOpenChange(false));

  // Subscribe to realtime updates when a room code is entered
  useEffect(() => {
    if (!roomCode || roomCode.length !== 6 || !room?.id) return;

    const playersChannel = supabase.channel('players-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `session_id=eq.${room.id}`
        },
        async (payload) => {
          const { data: updatedPlayers } = await supabase
            .from('game_players')
            .select(`
              id,
              display_name,
              user_id,
              current_score,
              users:users!inner(username)
            `)
            .eq('session_id', room.id);
            
          if (updatedPlayers) {
            setCurrentPlayers(updatedPlayers);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
    };
  }, [roomCode, room?.id, setCurrentPlayers]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Game Room</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Enter 6-character room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="font-mono text-center text-lg tracking-wider"
            />
          </div>
          
          {isLoading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          )}
          
          {room && (
            <div className="space-y-4">
              <RoomPlayersList 
                players={currentPlayers.length > 0 ? currentPlayers : room.game_players}
                maxPlayers={room.max_players}
                currentPlayers={room.current_players}
              />
              
              <Button 
                className="w-full" 
                onClick={handleJoin}
                disabled={room.current_players >= room.max_players}
              >
                {room.current_players >= room.max_players ? 'Room Full' : 'Join Game'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
