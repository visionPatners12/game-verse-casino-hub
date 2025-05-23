
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { CreateClassicRoomForm } from "@/components/room/CreateClassicRoomForm";
import { CreateArenaRoomForm } from "@/components/room/CreateArenaRoomForm";
import { toast } from "sonner";
import { useRoomValidation } from "@/hooks/room/useRoomValidation";
import { GameCode } from "@/lib/gameTypes";

const CreateRoom = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  
  const isValidGame = useRoomValidation(gameType);
  const validGameType = isValidGame ? gameType as GameCode : null;
  const isArenaGame = ["futarena", "eafc25", "madden24", "nba2k24", "nhl24"].includes(gameType || "");

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
      
      const { data, error } = await supabase
        .from('game_types')
        .select('*')
        .eq('code', validGameType)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!validGameType
  });

  return (
    <Layout>
      <div className="container mx-auto">
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
              isArenaGame ? (
                <CreateArenaRoomForm 
                  username={username} 
                  gameType={validGameType} 
                  gameConfig={gameConfig} 
                />
              ) : (
                <CreateClassicRoomForm 
                  username={username} 
                  gameType={validGameType} 
                  gameConfig={gameConfig} 
                />
              )
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateRoom;
