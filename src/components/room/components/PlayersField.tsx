
import { Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { CreateClassicRoomFormData } from "../schemas/createClassicRoomSchema";
import { CreateArenaRoomFormData } from "../schemas/createArenaRoomSchema";

type FormData = CreateClassicRoomFormData | CreateArenaRoomFormData;

type PlayersFieldProps = {
  form: UseFormReturn<FormData>;
  gameConfig: any;
};

export function PlayersField({ form, gameConfig }: PlayersFieldProps) {
  return (
    <FormField
      control={form.control}
      name="maxPlayers"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Number of Players
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              min={gameConfig?.min_players}
              max={gameConfig?.max_players}
              {...field}
              onChange={e => field.onChange(Number(e.target.value))}
              value={field.value || 2}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
