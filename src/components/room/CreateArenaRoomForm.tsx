
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createArenaRoomSchema, type CreateArenaRoomFormData } from "./schemas/createArenaRoomSchema";
import { BetAmountField } from "./components/BetAmountField";
import { GameFormLayout } from "./layouts/GameFormLayout";
import { GameConfigFields } from "./fields/GameConfigFields";
import { PlatformField } from "./fields/PlatformField";
import { GameModeField } from "./fields/GameModeField";
import { TeamTypeField } from "./fields/TeamTypeField";
import { GamerTagField } from "./components/GamerTagField";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";
import { GameCode } from "@/lib/gameTypes";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CreateArenaRoomFormProps {
  username: string;
  gameType: GameCode | undefined;
  gameConfig: any;
}

export function CreateArenaRoomForm({ username, gameType, gameConfig }: CreateArenaRoomFormProps) {
  const { user } = useAuth();
  const { createRoom } = useCreateRoom(username, gameType);
  const { checkBalance } = useWalletBalanceCheck();

  const form = useForm<CreateArenaRoomFormData>({
    resolver: zodResolver(createArenaRoomSchema),
    defaultValues: {
      bet: 0,
      maxPlayers: 2,
      halfLengthMinutes: 12,
      platform: "ps5",
      mode: "online_friendlies",
      teamType: "any_teams",
      legacyDefending: false,
      customFormations: false,
      _gameType: gameType,
      gamerTag: "",
    }
  });

  const onSubmit = async (values: CreateArenaRoomFormData) => {
    if (!user) return;

    const hasEnoughBalance = await checkBalance(values.bet);
    if (!hasEnoughBalance) return;

    // Update user's gamer tag based on platform
    try {
      const updateData = values.platform === "ps5" 
        ? { psn_username: values.gamerTag }
        : values.platform === "xbox_series"
        ? { xbox_gamertag: values.gamerTag }
        : { ea_id: values.gamerTag };

      const { error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) throw updateError;
      
      createRoom(values);
    } catch (error) {
      toast.error("Failed to update gamer tag");
    }
  };

  return (
    <GameFormLayout form={form} onSubmit={onSubmit}>
      <div className="space-y-6">
        <BetAmountField form={form} />
        <GameConfigFields form={form} />
        <PlatformField form={form} />
        <GamerTagField form={form} />
        <GameModeField form={form} />
        <TeamTypeField form={form} />
      </div>
    </GameFormLayout>
  );
}
