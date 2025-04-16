import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { CreateRoomForm } from "@/components/room/CreateRoomForm";
import { GameCode, isValidGameType } from "@/lib/gameTypes";

const CreateRoom = () => {
  const { gameType } = useParams<{ gameType: string }>();
  const [username, setUsername] = useState("");

  // Get a type-safe gameType or null
  const validGameType = isValidGameType(gameType) ? gameType : null;

  useEffect(() => {
    const getUsername = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUsername(profile.username);
        }
      }
    };
    getUsername();
  }, []);

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
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Create a Room</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <CreateRoomForm 
                username={username} 
                gameType={gameType} 
                gameConfig={gameConfig} 
              />
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GameVerse Casino. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CreateRoom;
