
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createRoomSchema, type CreateRoomFormData } from "./schemas/createRoomSchema";
import { BetAmountField } from "./components/BetAmountField";
import { PlayersField } from "./components/PlayersField";
import { WinnersField } from "./components/WinnersField";
import { GridSizeField } from "./components/GridSizeField";
import { useCreateRoom } from "./hooks/useCreateRoom";
import { Input } from "@/components/ui/input";
import { Timer, Text, Database } from "lucide-react";

type CreateRoomFormProps = {
  username: string;
  gameType: string | undefined;
  gameConfig: any;
};

export function CreateRoomForm({ username, gameType, gameConfig }: CreateRoomFormProps) {
  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      bet: 0,
      maxPlayers: gameConfig?.min_players || 2,
      winnerCount: 1,
      gridSize: gameType === 'tictactoe' ? 3 : undefined,
      matchDuration: 12,
      eaId: "",
      schemaCache: ""
    },
  });

  const { createRoom } = useCreateRoom(username, gameType);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createRoom)} className="space-y-4">
        <BetAmountField form={form} disableControls={true} />
        <PlayersField form={form} gameConfig={gameConfig} />
        <WinnersField form={form} />

        {gameType === 'tictactoe' && gameConfig?.is_configurable && (
          <GridSizeField form={form} />
        )}

        {gameType === "futarena" && (
          <>
            <FormField
              control={form.control}
              name="matchDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Durée du match (minutes)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-md border px-4 py-3 bg-accent/25">
              <FormField
                control={form.control}
                name="eaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-base text-primary">
                      <Text className="h-5 w-5" />
                      ⚽ Ton EA&nbsp;ID (obligatoire pour FUT)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Entre ton identifiant EA"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="schemaCache"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Schema Cache (spécifique au jeu)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Paramètre schema cache"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button 
          type="submit" 
          className="w-full"
          disabled={!username}
        >
          Create Room
        </Button>
      </form>
    </Form>
  );
}
