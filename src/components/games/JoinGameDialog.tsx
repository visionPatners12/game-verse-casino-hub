
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GameCode, isValidGameType } from "@/lib/gameTypes";

interface JoinGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JoinGameDialog = ({ open, onOpenChange }: JoinGameDialogProps) => {
  const [roomCode, setRoomCode] = useState("");
  const [currentPlayers, setCurrentPlayers] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: room, isLoading } = useQuery({
    queryKey: ['game-session', roomCode],
    queryFn: async () => {
      if (roomCode.length !== 6) return null;
      
      const { data, error } = await supabase
        .from('game_sessions')
        .select(`
          *,
          game_players:game_players(
            id,
            display_name,
            user_id,
            current_score
          )
        `)
        .eq('room_id', roomCode)
        .single();
        
      if (error) {
        if (error.code === 'PGRST116') {
          toast({
            variant: "destructive",
            title: "Room not found",
            description: "Please check the room code and try again."
          });
        }
        throw error;
      }
      
      return data;
    },
    enabled: roomCode.length === 6,
    retry: false
  });

  // Subscribe to realtime updates when a room code is entered
  useEffect(() => {
    if (!roomCode || roomCode.length !== 6) return;

    // Subscribe to changes in game_players table for this room
    const playersChannel = supabase.channel('players-list')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `session_id=eq.${room?.id}`
        },
        async (payload) => {
          // Fetch updated players list
          const { data: updatedPlayers } = await supabase
            .from('game_players')
            .select(`
              id,
              display_name,
              user_id,
              current_score,
              users:users!inner(username)
            `)
            .eq('session_id', room?.id);
            
          if (updatedPlayers) {
            setCurrentPlayers(updatedPlayers);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playersChannel);
    };
  }, [roomCode, room?.id]);
  
  const handleJoin = async () => {
    if (!room) return;
    
    if (room.current_players >= room.max_players) {
      toast({
        variant: "destructive",
        title: "Room is full",
        description: "Please try another room."
      });
      return;
    }
    
    try {
      // Get user info
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please sign in to join a game room."
        });
        return;
      }
      
      // Fetch username from users table
      const { data: userData } = await supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (!userData?.username) {
        toast({
          variant: "destructive",
          title: "Profile incomplete",
          description: "Please set up your username in your profile."
        });
        return;
      }

      // Check if user is already in the room
      const existingPlayerCheck = await supabase
        .from('game_players')
        .select('id')
        .eq('session_id', room.id)
        .eq('user_id', user.id)
        .single();
        
      if (!existingPlayerCheck.error) {
        // User is already in the room, just navigate there
        console.log("User already in room, navigating...");
      } else {
        // Add user to the room
        const { error: joinError } = await supabase
          .from('game_players')
          .insert({
            session_id: room.id,
            display_name: userData.username,
            user_id: user.id
          });
          
        if (joinError) throw joinError;
      }
      
      // Get game type and validate
      const gameType = typeof room.game_type === 'string' 
        ? room.game_type.toLowerCase()
        : String(room.game_type).toLowerCase();
      
      if (!isValidGameType(gameType)) {
        console.error("Invalid game type:", gameType, "Room data:", room);
        toast({
          variant: "destructive",
          title: "Invalid game type",
          description: "This game type is not supported."
        });
        return;
      }
      
      // Navigate to the game room
      navigate(`/games/${gameType}/room/${room.id}`);
      onOpenChange(false);
    } catch (error) {
      console.error("Join error:", error);
      toast({
        variant: "destructive",
        title: "Failed to join room",
        description: "Please try again later."
      });
    }
  };

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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>
                    {room.current_players}/{room.max_players} Players
                  </span>
                </div>
                {room.current_players < room.max_players ? (
                  <span className="text-sm text-muted-foreground">
                    Waiting for players...
                  </span>
                ) : (
                  <span className="text-sm text-destructive">
                    Room is full
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {(currentPlayers.length > 0 ? currentPlayers : room.game_players).map((player: any) => (
                  <div 
                    key={player.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted"
                  >
                    {player.users?.username || player.display_name}
                  </div>
                ))}
                {Array.from({ length: room.max_players - room.current_players }).map((_, i) => (
                  <div 
                    key={`empty-${i}`}
                    className="flex items-center gap-2 p-2 rounded-md border border-dashed"
                  >
                    Waiting...
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleJoin}
                disabled={room.current_players >= room.max_players}
              >
                Join Game
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
