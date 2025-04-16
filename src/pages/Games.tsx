
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GamesList from "@/components/games/GamesList";
import { JoinGameDialog } from "@/components/games/JoinGameDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Games = () => {
  const navigate = useNavigate();
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  
  const { data: games, isLoading } = useQuery({
    queryKey: ['game-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('game_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data.map(game => ({
        id: game.id,
        name: game.name,
        type: game.code,
        description: `${game.min_players}${game.max_players > game.min_players ? `-${game.max_players}` : ''} players`,
        players: {
          min: game.min_players,
          max: game.max_players
        },
        image: game.image_url || "https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3"
      }));
    }
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Games</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate('/games/create')}
              variant="outline"
            >
              Create Room
            </Button>
            <Button 
              onClick={() => setJoinDialogOpen(true)}
            >
              Join a Game
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading games...</p>
          </div>
        ) : games ? (
          <GamesList games={games} />
        ) : null}
      </main>
      
      <JoinGameDialog 
        open={joinDialogOpen}
        onOpenChange={setJoinDialogOpen}
      />
      
      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GameVerse Casino. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Games;
