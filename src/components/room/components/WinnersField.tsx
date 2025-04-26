
import { Trophy } from "lucide-react";
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

type WinnersFieldProps = {
  form: UseFormReturn<CreateRoomFormData>;
};

export function WinnersField({ form }: WinnersFieldProps) {
  return (
    <FormField
      control={form.control}
      name="winnerCount"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Number of Winners
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              min={1}
              max={form.getValues("maxPlayers") ? Number(form.getValues("maxPlayers")) - 1 : 1}
              {...field}
              onChange={e => field.onChange(Number(e.target.value))}
              value={field.value || 1}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
