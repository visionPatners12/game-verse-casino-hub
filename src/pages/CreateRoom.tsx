
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, Trophy, Grid3X3 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { gameCodeToType } from "@/lib/gameTypes";

const createRoomSchema = z.object({
  bet: z.number().min(0, "Bet amount must be positive"),
  maxPlayers: z.number().min(2, "Must have at least 2 players"),
  winnerCount: z.number().min(1, "Must have at least 1 winner"),
  gridSize: z.number().optional(),
});

// Define the GameCode type explicitly to match the keys in gameCodeToType
type GameCode = keyof typeof gameCodeToType;

const CreateRoom = () => {
  const navigate = useNavigate();
  const { gameType } = useParams<{ gameType: string }>();
  const [username, setUsername] = useState("");

  // Validate the gameType and ensure it's a valid GameCode
  const validGameType: GameCode | null = (gameType && Object.keys(gameCodeToType).includes(gameType)) 
    ? gameType as GameCode 
    : null;

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
    // Fix the queryKey typing by not including null values
    queryKey: ['game-type', validGameType] as const,
    queryFn: async () => {
      if (!validGameType) throw new Error("Game type not specified or invalid");
      
      // Use the validGameType directly since we've already confirmed it's valid
      const { data, error } = await supabase
        .from('game_types')
        .select('*')
        .eq('code', validGameType as GameCode)
        .single();
      
      if (error) throw error;
      return data;
    },
    // Only run the query when validGameType is not null
    enabled: !!validGameType
  });

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      bet: 0,
      maxPlayers: gameConfig?.min_players || 2,
      winnerCount: 1,
      gridSize: validGameType === 'tictactoe' ? 3 : undefined,
    },
  });

  const handleCreateRoom = async (values: z.infer<typeof createRoomSchema>) => {
    try {
      if (!validGameType) {
        console.error("Invalid game type");
        return;
      }
      
      // Use the gameCodeToType mapping to get the correct enum value
      const gameTypeEnum = gameCodeToType[validGameType];
      
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          game_type: gameTypeEnum,
          room_type: 'private',
          room_id: Math.random().toString(36).substring(2, 8).toUpperCase(),
          max_players: values.maxPlayers,
          entry_fee: values.bet,
          commission_rate: 5,
        })
        .select()
        .single();

      if (error) throw error;

      const { error: playerError } = await supabase
        .from('game_players')
        .insert({
          session_id: data.id,
          display_name: username,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (playerError) throw playerError;

      navigate(`/games/${validGameType}/room/${data.id}`);
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
            <CardTitle>Create a Room</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateRoom)} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Player Name</label>
                    <Input
                      value={username}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bet Amount ($)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxPlayers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Number of Players
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={gameConfig?.min_players}
                            max={gameConfig?.max_players}
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="winnerCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Trophy className="h-4 w-4" />
                          Number of Winners
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={form.watch('maxPlayers') - 1}
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {validGameType === 'tictactoe' && gameConfig?.is_configurable && (
                    <FormField
                      control={form.control}
                      name="gridSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Grid3X3 className="h-4 w-4" />
                            Grid Size
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min={3}
                              max={5}
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" className="w-full">
                    Create Room
                  </Button>
                </form>
              </Form>
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
