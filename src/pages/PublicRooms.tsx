import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, DollarSign } from "lucide-react";
import { gameCodeToType } from "@/lib/gameTypes";
import { Layout } from "@/components/Layout";

const PublicRooms = () => {
  const { gameType } = useParams();
  const navigate = useNavigate();
  
  const { data: rooms, isLoading } = useQuery({
    queryKey: ['public-rooms', gameType],
    queryFn: async () => {
      if (!gameType || !gameCodeToType[gameType]) return [];
      
      const { data, error } = await supabase
        .from('game_sessions')
        .select(`
          *,
          game_players(*)
        `)
        .eq('game_type', gameCodeToType[gameType])
        .eq('room_type', 'public')
        .eq('status', 'Waiting')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 5000 // Refresh every 5 seconds
  });

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Public Rooms - {gameType?.toUpperCase()}</h1>
        <Button onClick={() => navigate(`/games/${gameType}/create`)}>
          Create Room
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : rooms?.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">No public rooms available.</p>
            <Button onClick={() => navigate(`/games/${gameType}/create`)} className="mt-4">
              Create a Room
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rooms?.map((room) => (
            <Card key={room.id} className="hover:bg-accent/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Room #{room.room_id}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Created {new Date(room.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {room.current_players}/{room.max_players}
                    <Users className="h-3 w-3 ml-1" />
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    ${room.entry_fee} Bet
                  </Badge>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={() => navigate(`/games/${gameType}/room/${room.id}`)}
                  disabled={room.current_players >= room.max_players}
                >
                  {room.current_players >= room.max_players ? 'Room Full' : 'Join Room'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default PublicRooms;
