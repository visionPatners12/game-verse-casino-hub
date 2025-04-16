
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
};

export function BetAmountField({ form }: BetAmountFieldProps) {
  return (
    <FormField
      control={form.control}
      name="bet"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Bet Amount ($)</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="number"
                min="0"
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
