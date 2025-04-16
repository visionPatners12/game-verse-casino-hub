
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Grid3X3 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { gameCodeToType } from "@/lib/gameTypes";

const createRoomSchema = z.object({
  bet: z.number().min(0, "Bet amount must be positive"),
  maxPlayers: z.number().min(2, "Must have at least 2 players"),
  winnerCount: z.number().min(1, "Must have at least 1 winner"),
  gridSize: z.number().optional(),
});

type CreateRoomFormProps = {
  username: string;
  gameType: string | undefined;
  gameConfig: any;
};

export function CreateRoomForm({ username, gameType, gameConfig }: CreateRoomFormProps) {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      bet: 0,
      maxPlayers: gameConfig?.min_players || 2,
      winnerCount: 1,
      gridSize: gameType === 'tictactoe' ? 3 : undefined,
    },
  });

  const handleCreateRoom = async (values: z.infer<typeof createRoomSchema>) => {
    try {
      if (!gameType || !Object.keys(gameCodeToType).includes(gameType)) {
        console.error("Invalid game type");
        return;
      }
      
      // Safely convert string gameType to enum value
      const gameTypeEnum = gameCodeToType[gameType as keyof typeof gameCodeToType];
      
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

      navigate(`/games/${gameType}/room/${data.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
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

        {gameType === 'tictactoe' && gameConfig?.is_configurable && (
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
  );
}
