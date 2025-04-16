
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const CreateRoom = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<string>("");
  const [playerName, setPlayerName] = useState("");
  const [bet, setBet] = useState<number>(0);
  const [gridSize, setGridSize] = useState<number>(3); // For tic-tac-toe
  
  const { data: games, isLoading } = useQuery({
    queryKey: ['game-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const handleCreateRoom = async () => {
    if (!selectedGame || !playerName) return;

    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          game_type: selectedGame,
          room_type: 'private',
          room_id: Math.random().toString(36).substring(2, 8).toUpperCase(),
          max_players: games?.find(g => g.code === selectedGame)?.max_players || 2,
          entry_fee: bet,
          commission_rate: 5
        })
        .select()
        .single();

      if (error) throw error;

      // Add player to the game
      const { error: playerError } = await supabase
        .from('game_players')
        .insert({
          session_id: data.id,
          display_name: playerName,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (playerError) throw playerError;

      navigate(`/games/${selectedGame}/room/${data.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Create a Game Room</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  {games?.map((game) => (
                    <Button
                      key={game.id}
                      variant={selectedGame === game.code ? "default" : "outline"}
                      onClick={() => setSelectedGame(game.code)}
                      className="h-24"
                    >
                      {game.name}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({game.min_players}-{game.max_players} players)
                      </span>
                    </Button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Player Name</label>
                  <Input
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Bet Amount ($)</label>
                  <Input
                    type="number"
                    min="0"
                    value={bet}
                    onChange={(e) => setBet(Number(e.target.value))}
                  />
                </div>

                {selectedGame === 'tictactoe' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Grid Size</label>
                    <Input
                      type="number"
                      min="3"
                      max="5"
                      value={gridSize}
                      onChange={(e) => setGridSize(Number(e.target.value))}
                    />
                  </div>
                )}

                <Button 
                  onClick={handleCreateRoom}
                  disabled={!selectedGame || !playerName}
                  className="w-full"
                >
                  Create Room
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateRoom;
