
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
import { CreateRoomFormData } from "../schemas/createRoomSchema";

type PlayersFieldProps = {
  form: UseFormReturn<CreateRoomFormData>;
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
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
