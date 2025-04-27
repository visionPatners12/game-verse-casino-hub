import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomSchema, type CreateRoomFormData } from "./schemas/createRoomSchema";
import { BetAmountField } from "./components/BetAmountField";
import { GameFormLayout } from "./layouts/GameFormLayout";
import { GameConfigFields } from "./fields/GameConfigFields";
import { PlatformField } from "./fields/PlatformField";
import { GameModeField } from "./fields/GameModeField";
import { TeamTypeField } from "./fields/TeamTypeField";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";
import { GameCode } from "@/lib/gameTypes";

interface CreateArenaRoomFormProps {
  username: string;
  gameType: GameCode | undefined;
  gameConfig: any;
}

export function CreateArenaRoomForm({ username, gameType, gameConfig }: CreateArenaRoomFormProps) {
  const { createRoom } = useCreateRoom(username, gameType);
  const { checkBalance } = useWalletBalanceCheck();

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      bet: 0,
      maxPlayers: 2,
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

  return (
    <GameFormLayout form={form} onSubmit={onSubmit} showRules>
      <BetAmountField form={form} />
      <GameConfigFields form={form} />
      <PlatformField form={form} />
      <GameModeField form={form} />
      <TeamTypeField form={form} />
    </GameFormLayout>
  );
}
