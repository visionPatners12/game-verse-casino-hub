
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Timer, Text } from "lucide-react";
import { createRoomSchema, type CreateRoomFormData } from "./schemas/createRoomSchema";
import { BetAmountField } from "./components/BetAmountField";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";
import { GameCode } from "@/lib/gameTypes";
import { useState } from "react";
import { RulesDialog } from "@/components/game/RulesDialog";
import { RulesAcceptedBlock } from "./components/RulesAcceptedBlock";

interface CreateEAFC25FormProps {
  username: string;
  gameType: GameCode | undefined;
  gameConfig: any;
}

export function CreateEAFC25Form({ username, gameType, gameConfig }: CreateEAFC25FormProps) {
  const [showRulesDialog, setShowRulesDialog] = useState(true);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const { createRoom } = useCreateRoom(username, gameType);
  const { checkBalance } = useWalletBalanceCheck();

  const form = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      bet: 0,
      _gameType: gameType,
      halfLengthMinutes: 12,
      platform: 'ps5',
      mode: 'online_friendlies',
      teamType: 'any_teams',
      legacyDefending: false,
      customFormations: false,
      maxPlayers: 2
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
    setRulesAccepted(true);
  };

  return (
    <>
      <RulesDialog 
        open={showRulesDialog} 
        onOpenChange={setShowRulesDialog}
        onAccept={handleAcceptRules}
      />

      {rulesAccepted && <RulesAcceptedBlock />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <BetAmountField form={form} />

          <FormField
            control={form.control}
            name="halfLengthMinutes"
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
                    max={45}
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
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plateforme</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une plateforme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ps5">PS5</SelectItem>
                    <SelectItem value="xbox_series">Xbox Series X</SelectItem>
                    <SelectItem value="cross_play">Cross-play</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode de jeu</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="online_friendlies">Online Friendlies</SelectItem>
                    <SelectItem value="fut">FUT</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="teamType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type d'équipes</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type d'équipe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="any_teams">Any Teams</SelectItem>
                    <SelectItem value="85_rated">85 Rated</SelectItem>
                    <SelectItem value="country">National Only</SelectItem>
                    <SelectItem value="fut_team">FUT Team</SelectItem>
                  </SelectContent>
                </Select>
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
                    checked={field.value}
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
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create Room
          </Button>
        </form>
      </Form>
    </>
  );
}
