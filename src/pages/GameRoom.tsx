import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import GameChat from "@/components/GameChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { isValidGameType, gameCodeToType } from "@/lib/gameTypes";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Share2, ExternalLink, DollarSign, Loader2, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RoomData {
  id: string;
  game_type: string;
  max_players: number;
  current_players: number;
  room_type: string;
  entry_fee: number;
  commission_rate: number;
  room_id: string;
  pot: number;
  status: string;
  created_at: string;
  game_players: {
    id: string;
    display_name: string;
    user_id: string;
    current_score: number;
  }[];
}

const GameRoom = () => {
  const { gameType, roomId } = useParams<{ gameType: string; roomId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Validate game type
  useEffect(() => {
    if (!isValidGameType(gameType)) {
      toast({
        title: "Invalid Game Type",
        description: "The requested game does not exist.",
        variant: "destructive"
      });
      navigate("/games");
    }
  }, [gameType, navigate, toast]);
  
  // Fetch room data from Supabase
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
        
        // Fetch room data
        const { data, error } = await supabase
          .from('game_sessions')
          .select(`
            *,
            game_players (
              id,
              display_name,
              user_id,
              current_score
            )
          `)
          .eq('id', roomId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          toast({
            title: "Room Not Found",
            description: "The requested game room does not exist.",
            variant: "destructive"
          });
          navigate("/games");
          return;
        }
        
        console.log("Room data:", data);
        setRoomData(data as RoomData);
      } catch (error) {
        console.error("Error fetching room data:", error);
        toast({
          title: "Error Loading Room",
          description: "Could not load game room data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomData();
  }, [roomId, navigate, toast]);
  
  // Set up realtime subscription for room updates
  useEffect(() => {
    if (!roomId) return;
    
    // Subscribe to changes in the game_sessions table for this specific room
    const roomChannel = supabase
      .channel('room-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          console.log('Room updated:', payload);
          // Refresh room data when it changes
          if (payload.new) {
            setRoomData(prev => ({
              ...prev,
              ...payload.new
            } as RoomData));
          }
        }
      )
      .subscribe();
    
    // Subscribe to changes in the game_players table for this room
    const playersChannel = supabase
      .channel('players-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_players',
          filter: `session_id=eq.${roomId}`
        },
        (payload) => {
          console.log('Players updated:', payload);
          // Refresh room data when players change
          fetchUpdatedPlayers();
        }
      )
      .subscribe();
    
    const fetchUpdatedPlayers = async () => {
      const { data, error } = await supabase
        .from('game_players')
        .select('*')
        .eq('session_id', roomId);
      
      if (!error && data) {
        setRoomData(prev => prev ? {
          ...prev,
          game_players: data,
          current_players: data.length
        } as RoomData : null);
      }
    };
    
    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(playersChannel);
    };
  }, [roomId]);
  
  const copyRoomLink = () => {
    const roomUrl = `${window.location.origin}/games/${gameType}/room/${roomId}`;
    navigator.clipboard.writeText(roomUrl);
    
    toast({
      title: "Link Copied",
      description: "Room link copied to clipboard!",
    });
  };
  
  // Show loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-medium">Loading game room...</h2>
          </div>
        </main>
      </div>
    );
  }
  
  // Calculate winner takes amount (total pot including commission adjustment)
  const gameName = gameType ? gameType.charAt(0).toUpperCase() + gameType.slice(1) : "Unknown Game";
  const totalPot = roomData ? roomData.entry_fee * roomData.current_players * (1 - roomData.commission_rate/100) : 0;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="w-full lg:w-2/3">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    {gameName} Room
                    {roomData && (
                      <span className="text-sm font-normal text-muted-foreground">
                        (Room Code: <span className="font-mono bg-muted px-1 py-0.5 rounded">{roomData.room_id}</span>)
                      </span>
                    )}
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={copyRoomLink}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="hidden sm:inline">Copy Link</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        toast({
                          title: "Sharing",
                          description: "Opening share dialog",
                        });
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        toast({
                          title: "Opening in New Window",
                          description: "Game opened in fullscreen mode",
                        });
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {roomData && (
                  <>
                    <div className="flex justify-between items-center mb-4 p-3 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-accent" />
                        <div>
                          <div className="text-sm font-medium">Bet Amount</div>
                          <div className="text-xl font-semibold">${roomData.entry_fee}</div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm font-medium text-right">Prize Pool</div>
                        <div className="text-xl font-semibold text-accent">
                          ${totalPot.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Players ({roomData.current_players}/{roomData.max_players})
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {roomData.game_players.map(player => (
                          <div 
                            key={player.id} 
                            className={`px-3 py-2 rounded-md ${player.user_id === currentUserId ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                          >
                            <span className="font-medium">{player.display_name}</span>
                            {player.current_score > 0 && (
                              <span className="ml-2 text-sm">({player.current_score} pts)</span>
                            )}
                          </div>
                        ))}
                        
                        {Array.from({ length: roomData.max_players - roomData.current_players }).map((_, index) => (
                          <div 
                            key={`empty-${index}`}
                            className="px-3 py-2 rounded-md border border-dashed border-muted-foreground text-muted-foreground text-center"
                          >
                            Waiting for player...
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                <div className="game-container">
                  <div className="bg-accent/10 rounded-lg border border-border aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">Game Canvas</h3>
                      <p className="text-muted-foreground">Custom game implementation will be displayed here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-1/3">
            <GameChat />
          </div>
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GameVerse Casino. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default GameRoom;
