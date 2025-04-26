
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomSchema, type CreateRoomFormData } from "./schemas/createRoomSchema";
import { BetAmountField } from "./components/BetAmountField";
import { PlayersField } from "./components/PlayersField";
import { WinnersField } from "./components/WinnersField";
import { GridSizeField } from "./components/GridSizeField";
import { GameFormLayout } from "./layouts/GameFormLayout";
import { GameConfigFields } from "./fields/GameConfigFields";
import { PlatformField } from "./fields/PlatformField";
import { GameModeField } from "./fields/GameModeField";
import { TeamTypeField } from "./fields/TeamTypeField";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";
import { GameCode } from "@/lib/gameTypes";

interface CreateRoomFormProps {
  username: string;
  gameType: GameCode | undefined;
  gameConfig: any;
}

export function CreateRoomForm({ username, gameType, gameConfig }: CreateRoomFormProps) {
  const { createRoom } = useCreateRoom(username, gameType);
  const { checkBalance } = useWalletBalanceCheck();

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      bet: 0,
      maxPlayers: gameConfig?.min_players || 2,
      winnerCount: 1,
      gridSize: 3,
      halfLengthMinutes: 12,
      platform: 'ps5',
      mode: 'online_friendlies',
      teamType: 'any_teams',
      legacyDefending: false,
      customFormations: false,
      _gameType: gameType
    }
  });

  const onSubmit = async (values: CreateRoomFormData) => {
    const hasEnoughBalance = await checkBalance(values.bet);
    if (hasEnoughBalance) {
      createRoom(values);
    }
  };

  const showGridSizeField = gameType === "tictactoe";
  const showFutArenaFields = gameType === "futarena";

  return (
    <GameFormLayout form={form} onSubmit={onSubmit} showRulesDialog={gameType === "futarena"}>
      <BetAmountField form={form} />
      <PlayersField form={form} gameConfig={gameConfig} />
      <WinnersField form={form} />
      {showGridSizeField && <GridSizeField form={form} />}
      {showFutArenaFields && (
        <>
          <GameConfigFields form={form} showEAID />
          <PlatformField form={form} />
          <GameModeField form={form} />
          <TeamTypeField form={form} />
        </>
      )}
    </GameFormLayout>
  );
}
