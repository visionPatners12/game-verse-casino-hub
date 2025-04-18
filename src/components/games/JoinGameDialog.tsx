
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
  const [playersChannel, setPlayersChannel] = useState<ReturnType<typeof supabase.channel> | null>(null);

  // Subscribe to realtime updates when a room code is entered
  useEffect(() => {
    if (!roomCode || roomCode.length !== 6 || !room?.id) {
      if (playersChannel) {
        supabase.removeChannel(playersChannel);
        setPlayersChannel(null);
      }
      return;
    }

    // Create a new channel for this room with presence enabled
    const channel = supabase.channel(`players-list-${room.id}`, {
      config: {
        broadcast: { self: true },
        presence: {
          key: room.id,
        },
      },
    });

    // Subscribe to all changes in the game_players table for this session
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `session_id=eq.${room.id}`
        },
        async (payload) => {
          console.log('Player update received:', payload);
          try {
            // Important: Use the join syntax to get user data
            const { data: updatedPlayers, error } = await supabase
              .from('game_players')
              .select(`
                id, 
                display_name, 
                user_id, 
                current_score, 
                is_connected,
                users:user_id(username, avatar_url)
              `)
              .eq('session_id', room.id);
              
            if (error) {
              console.error("Error fetching updated players:", error);
              return;
            }
            
            if (updatedPlayers) {
              console.log("Updated players with user data:", updatedPlayers);
              setCurrentPlayers(updatedPlayers);
            }
          } catch (err) {
            console.error("Error processing player update:", err);
          }
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status for room ${room.id}:`, status);
      });

    setPlayersChannel(channel);

    // Initial fetch with user data
    const fetchInitialPlayers = async () => {
      try {
        // Use the join syntax to get user data
        const { data: initialPlayers, error } = await supabase
          .from('game_players')
          .select(`
            id, 
            display_name, 
            user_id, 
            current_score, 
            is_connected,
            users:user_id(username, avatar_url)
          `)
          .eq('session_id', room.id);
          
        if (error) {
          console.error("Error fetching initial players:", error);
          return;
        }
        
        if (initialPlayers) {
          console.log("Initial players with user data:", initialPlayers);
          setCurrentPlayers(initialPlayers);
        }
      } catch (err) {
        console.error("Error fetching initial players:", err);
      }
    };
    
    fetchInitialPlayers();

    // Cleanup function
    return () => {
      console.log("Cleaning up channel for room:", room.id);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [roomCode, room?.id]);

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
