import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GamesList from "@/components/games/GamesList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { JoinGameDialog } from "@/components/games/JoinGameDialog";
import { Layout } from "@/components/Layout";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Gamepad } from "lucide-react";

const Games = () => {
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const { isAuthenticated, isLoading: authLoading } = useRequireAuth();
  
  const { data: games, isLoading: gamesLoading } = useQuery({
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
    },
    enabled: isAuthenticated
  });
  
  const isLoading = authLoading || gamesLoading;
  
  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Classic Games</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/arenaplay")}
            variant="outline"
            className="gap-2"
          >
            <Gamepad className="h-4 w-4" />
            ArenaPlay Games
          </Button>
          <Button 
            onClick={() => setIsJoinDialogOpen(true)}
            variant="outline"
            className="gap-2"
          >
            <Users className="h-4 w-4" />
            Join a Room
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

      <JoinGameDialog 
        open={isJoinDialogOpen} 
        onOpenChange={setIsJoinDialogOpen} 
      />
    </Layout>
  );
};

export default Games;
