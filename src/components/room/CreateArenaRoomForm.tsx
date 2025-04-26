
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createRoomSchema, type CreateRoomFormData } from "./schemas/createRoomSchema";
import { BetAmountField } from "./components/BetAmountField";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { Gamepad } from "lucide-react";
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
      _gameType: gameType
    }
  });

  const onSubmit = async (values: CreateRoomFormData) => {
    console.log("Form values:", values);
    const hasEnoughBalance = await checkBalance(values.bet);
    if (hasEnoughBalance) {
      createRoom(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center gap-2 text-primary">
          <Gamepad className="h-5 w-5" />
          <span className="font-medium">Arena Room Creation</span>
        </div>

        <BetAmountField form={form} />

        <Button type="submit" className="w-full">
          Create Room
        </Button>
      </form>
    </Form>
  );
}
