
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createRoomSchema, type CreateRoomFormData } from "./schemas/createRoomSchema";
import { PlayerNameField } from "./components/PlayerNameField";
import { BetAmountField } from "./components/BetAmountField";
import { PlayersField } from "./components/PlayersField";
import { WinnersField } from "./components/WinnersField";
import { GridSizeField } from "./components/GridSizeField";
import { useCreateRoom } from "./hooks/useCreateRoom";

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
    },
  });

  const { createRoom } = useCreateRoom(username, gameType);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createRoom)} className="space-y-4">
        <PlayerNameField username={username} />
        <BetAmountField form={form} />
        <PlayersField form={form} gameConfig={gameConfig} />
        <WinnersField form={form} />
        
        {gameType === 'tictactoe' && gameConfig?.is_configurable && (
          <GridSizeField form={form} />
        )}

        <Button type="submit" className="w-full">
          Create Room
        </Button>
      </form>
    </Form>
  );
}
