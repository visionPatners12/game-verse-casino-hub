
import { useState } from "react";
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
      
      const displayName = userData?.username || "Player";
      
      // Check if user is already in the room
      const existingPlayerCheck = await supabase
        .from('game_players')
        .select('id')
        .eq('session_id', room.id)
        .eq('user_id', user.id)
        .single();
        
      if (existingPlayerCheck.data) {
        // User is already in the room, just navigate there
        console.log("User already in room, navigating...");
      } else {
        // Add user to the room
        const { error } = await supabase
          .from('game_players')
          .insert({
            session_id: room.id,
            display_name: displayName,
            user_id: user.id
          });
          
        if (error) throw error;
      }
      
      // Handle game_type safely - it could be an enum value like "Ludo" from the database
      let gameType = "";
      
      if (typeof room.game_type === 'string') {
        // Convert game type like "Ludo" or "Checkers" to lowercase code like "ludo"
        gameType = room.game_type.toLowerCase();
      } else if (room.game_type) {
        // Fallback to string conversion
        gameType = String(room.game_type).toLowerCase();
      }
      
      // Validate game type
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
                {room.game_players.map((player: any) => (
                  <div 
                    key={player.id}
                    className="flex items-center gap-2 p-2 rounded-md bg-muted"
                  >
                    {player.display_name}
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
