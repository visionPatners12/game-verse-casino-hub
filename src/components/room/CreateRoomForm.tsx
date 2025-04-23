
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
import { Timer, Text } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";

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
      matchDuration: gameType === "futarena" ? 12 : undefined,
      eaId: "",
      _gameType: gameType,
    },
    mode: "onChange"
  });

  const { createRoom } = useCreateRoom(username, gameType);
  const { wallet } = useWallet();

  const handleSubmit = async (values: CreateRoomFormData) => {
    // Vérifier le solde directement
    if (values.bet > 0 && (!wallet || wallet.real_balance < values.bet)) {
      toast.error("Solde insuffisant", {
        description: "Vous n'avez pas assez d'argent dans votre portefeuille pour créer cette partie."
      });
      return;
    }
    
    // Si le solde est suffisant ou pas de mise
    createRoom(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              name="eaId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Text className="h-4 w-4" />
                    Ton EA - ID <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Ton identifiant EA"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="matchDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Timer className="h-4 w-4" />
                    Durée du match (minutes) <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={60}
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                      required
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
