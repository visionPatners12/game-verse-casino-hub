import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { CreateRoomForm } from "@/components/room/CreateRoomForm";
import { GameRules } from "@/components/game/GameRules";
import { toast } from "sonner";
import { useRoomValidation } from "@/hooks/room/useRoomValidation";
import { GameCode } from "@/lib/gameTypes";

const CreateRoom = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  
  const isValidGame = useRoomValidation(gameType);
  const validGameType = isValidGame ? gameType : null;

  useEffect(() => {
    const getUsername = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast.error("You must be logged in to create a room");
          navigate("/auth");
          return;
        }

        const { data: profile, error } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error("Error fetching username:", error);
          return;
        }
        
        if (profile && profile.username) {
          setUsername(profile.username);
        } else {
          toast.warning("Please set up your username in your profile to create rooms");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    getUsername();
  }, [navigate]);

  const { data: gameConfig, isLoading } = useQuery({
    queryKey: ['game-type', validGameType],
    queryFn: async () => {
      if (!validGameType) throw new Error("Game type not specified or invalid");
      
      const classicGameTypes = ['ludo', 'checkers', 'tictactoe', 'checkgame', 'futarena'] as const;
      
      if (classicGameTypes.includes(validGameType as any)) {
        const { data, error } = await supabase
          .from('game_types')
          .select('*')
          .eq('code', validGameType)
          .single();
        
        if (error) throw error;
        return data;
      } else {
        return {
          code: validGameType,
          name: validGameType.charAt(0).toUpperCase() + validGameType.slice(1),
          min_players: 2,
          max_players: 2,
          is_configurable: false
        };
      }
    },
    enabled: !!validGameType
  });

  return (
    <Layout>
      <div className="container grid lg:grid-cols-2 gap-6 mx-auto">
        <div className="lg:order-1 order-2">
          {gameType && <GameRules gameType={gameType} />}
        </div>

        <div className="lg:order-2 order-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Create a Room 
                {gameConfig && <span className="text-primary">- {gameConfig.name}</span>}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <CreateRoomForm 
                  username={username} 
                  gameType={gameType as GameCode | undefined} 
                  gameConfig={gameConfig} 
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CreateRoom;
