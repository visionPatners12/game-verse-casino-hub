import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import GameChat from "@/components/GameChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { isValidGameType, gameCodeToType } from "@/lib/gameTypes";
import { RoomData } from "@/components/game/types";
import PlayersList from "@/components/game/PlayersList";
import RoomInfo from "@/components/game/RoomInfo";
import GameCanvas from "@/components/game/GameCanvas";
import RoomHeader from "@/components/game/RoomHeader";
import LoadingState from "@/components/game/LoadingState";

const GameRoom = () => {
  const { gameType, roomId } = useParams<{ gameType: string; roomId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  
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
  
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      try {
        setLoading(true);
        
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUserId(user?.id || null);
        
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
  
  useEffect(() => {
    if (!roomId) return;
    
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
          if (payload.new) {
            setRoomData(prev => ({
              ...prev,
              ...payload.new
            } as RoomData));
          }
        }
      )
      .subscribe();
    
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
                {!loading && roomData && (
                  <CardTitle>
                    <RoomHeader 
                      gameName={gameName} 
                      roomId={roomData.room_id}
                    />
                  </CardTitle>
                )}
              </CardHeader>
              <CardContent>
                {loading ? (
                  <LoadingState />
                ) : (
                  roomData && (
                    <>
                      <RoomInfo 
                        entryFee={roomData.entry_fee} 
                        totalPot={totalPot}
                        roomId={roomData.room_id}
                      />
                      
                      <PlayersList 
                        players={roomData.game_players}
                        maxPlayers={roomData.max_players}
                        currentUserId={currentUserId}
                      />
                      
                      <GameCanvas 
                        roomData={roomData}
                        currentUserId={currentUserId}
                      />
                    </>
                  )
                )}
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
