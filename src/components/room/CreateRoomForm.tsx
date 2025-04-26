
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createRoomSchema, type CreateRoomFormData } from "./schemas/createRoomSchema";
import { BetAmountField } from "./components/BetAmountField";
import { PlayersField } from "./components/PlayersField";
import { WinnersField } from "./components/WinnersField";
import { GridSizeField } from "./components/GridSizeField";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { Input } from "@/components/ui/input";
import { Timer, Text } from "lucide-react";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";
import { GameCode } from "@/lib/gameTypes";
import { useState } from "react";
import { RulesDialog } from "@/components/game/RulesDialog";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateRoomFormProps {
  username: string;
  gameType: GameCode | undefined;
  gameConfig: any;
}

export function CreateRoomForm({ username, gameType, gameConfig }: CreateRoomFormProps) {
  const [showRulesDialog, setShowRulesDialog] = useState(gameType === "futarena");
  const { createRoom } = useCreateRoom(username, gameType);
  const { checkBalance } = useWalletBalanceCheck();

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      bet: 0,
      maxPlayers: gameConfig?.min_players || 2,
      winnerCount: 1,
      gridSize: 3,
      matchDuration: 12,
      legacyDefending: false,
      customFormations: false,
      teamType: "anyTeams",
      _gameType: gameType
    }
  });

  const onSubmit = async (values: CreateRoomFormData) => {
    const hasEnoughBalance = await checkBalance(values.bet);
    if (hasEnoughBalance) {
      createRoom(values);
    }
  };

  const handleAcceptRules = () => {
    setShowRulesDialog(false);
  };

  // Only show certain fields for specific game types
  const showGridSizeField = gameType === "tictactoe";
  const showFutArenaFields = gameType === "futarena";

  return (
    <>
      <RulesDialog 
        open={showRulesDialog} 
        onOpenChange={setShowRulesDialog}
        onAccept={handleAcceptRules}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BetAmountField form={form} />

          <PlayersField form={form} gameConfig={gameConfig} />

          <WinnersField form={form} />

          {showGridSizeField && <GridSizeField form={form} />}

          {showFutArenaFields && (
            <>
              <FormField
                control={form.control}
                name="eaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Text className="h-4 w-4" />
                      EA ID (obligatoire)
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Votre EA ID" {...field} value={field.value || ''} />
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
                      Durée mi-temps (minutes)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={60}
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                        value={field.value || 5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="legacyDefending"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Legacy Defending</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customFormations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Formations personnalisées</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value || false}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="teamType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'équipes</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString() || "anyTeams"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type d'équipe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="anyTeams">Any Teams</SelectItem>
                        <SelectItem value="clubOnly">Club Only</SelectItem>
                        <SelectItem value="nationalOnly">National Only</SelectItem>
                        <SelectItem value="85rated">85 Rated</SelectItem>
                        <SelectItem value="futTeam">FUT Team</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" className="w-full">
            Create Room
          </Button>
        </form>
      </Form>
    </>
  );
}
