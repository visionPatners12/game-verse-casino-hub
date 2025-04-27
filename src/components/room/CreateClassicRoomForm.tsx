
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClassicRoomSchema, type CreateClassicRoomFormData } from "./schemas/createClassicRoomSchema";
import { BetAmountField } from "./components/BetAmountField";
import { GameFormLayout } from "./layouts/GameFormLayout";
import { PlayersField } from "./components/PlayersField";
import { WinnersField } from "./components/WinnersField";
import { GridSizeField } from "./components/GridSizeField";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";
import { GameCode } from "@/lib/gameTypes";

interface CreateClassicRoomFormProps {
  username: string;
  gameType: GameCode | undefined;
  gameConfig: any;
}

export function CreateClassicRoomForm({ username, gameType, gameConfig }: CreateClassicRoomFormProps) {
  const { createRoom } = useCreateRoom(username, gameType);
  const { checkBalance } = useWalletBalanceCheck();

  const form = useForm<CreateClassicRoomFormData>({
    resolver: zodResolver(createClassicRoomSchema),
    defaultValues: {
      bet: 0,
      maxPlayers: gameConfig?.min_players || 2,
      _gameType: gameType,
    }
  });

  const onSubmit = async (values: CreateClassicRoomFormData) => {
    const hasEnoughBalance = await checkBalance(values.bet);
    if (hasEnoughBalance) {
      createRoom(values);
    }
  };

  const showGridSizeField = gameType === "tictactoe";

  return (
    <GameFormLayout form={form} onSubmit={onSubmit}>
      <div className="space-y-6">
        <BetAmountField form={form} />
        <PlayersField form={form} gameConfig={gameConfig} />
        <WinnersField form={form} />
        {showGridSizeField && <GridSizeField form={form} />}
      </div>
    </GameFormLayout>
  );
}
