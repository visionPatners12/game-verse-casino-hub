
import { DollarSign } from "lucide-react";
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

type BetAmountFieldProps = {
  form: UseFormReturn<CreateRoomFormData>;
  disableControls?: boolean;
};

export function BetAmountField({ form, disableControls = false }: BetAmountFieldProps) {
  return (
    <FormField
      control={form.control}
      name="bet"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Bet Amount
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              min={0}
              inputMode="numeric"
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
