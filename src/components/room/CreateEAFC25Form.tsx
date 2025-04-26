import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createRoomSchema, type CreateRoomFormData } from "./schemas/createRoomSchema";
import { BetAmountField } from "./components/BetAmountField";
import { useCreateRoom } from "@/hooks/room/useCreateRoom";
import { Timer, Gamepad } from "lucide-react";
import { useWalletBalanceCheck } from "@/hooks/room/useWalletBalanceCheck";
import { GameCode } from "@/lib/gameTypes";

interface CreateEAFC25FormProps {
  username: string;
  gameType: GameCode | undefined;
  gameConfig: any;
}

export function CreateEAFC25Form({ username, gameType, gameConfig }: CreateEAFC25FormProps) {
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

  return (
    <div className="bg-gradient-to-br from-[#003791] to-[#0070CC] p-6 rounded-xl shadow-2xl">
      <div className="flex items-center justify-center mb-6">
        <Gamepad className="h-12 w-12 text-white mr-4" />
        <h2 className="text-3xl font-bold text-white">EA FC25 Room Setup</h2>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <BetAmountField form={form} />

          <FormField
            control={form.control}
            name="halfLengthMinutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-white">
                  <Timer className="h-5 w-5 text-white" />
                  Half Length (Minutes)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={45}
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))}
                    className="bg-white/10 text-white placeholder-white/50 border-white/30"
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
                <FormLabel className="text-white">Platform</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/10 text-white border-white/30">
                      <SelectValue placeholder="Select Platform" className="text-white" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ps5" className="focus:bg-blue-600">
                      <div className="flex items-center">
                        <span>PS5</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="xbox_series" className="focus:bg-green-600">
                      Xbox Series X
                    </SelectItem>
                    <SelectItem value="cross_play" className="focus:bg-purple-600">
                      Cross-play
                    </SelectItem>
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
                <FormLabel className="text-white">Game Mode</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/10 text-white border-white/30">
                      <SelectValue placeholder="Select Mode" className="text-white" />
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
                <FormLabel className="text-white">Team Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white/10 text-white border-white/30">
                      <SelectValue placeholder="Select Team Type" className="text-white" />
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

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="legacyDefending"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/30 p-3 bg-white/10">
                  <div className="space-y-0.5">
                    <FormLabel className="text-white">Legacy Defending</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-white/30"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customFormations"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-white/30 p-3 bg-white/10">
                  <div className="space-y-0.5">
                    <FormLabel className="text-white">Custom Formations</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-white/30"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#0070CC] hover:bg-[#005AB3] text-white transition-colors duration-300"
          >
            Create Room
          </Button>
        </form>
      </Form>
    </div>
  );
}
