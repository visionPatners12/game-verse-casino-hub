
import { Grid3X3 } from "lucide-react";
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

type GridSizeFieldProps = {
  form: UseFormReturn<CreateRoomFormData>;
};

export function GridSizeField({ form }: GridSizeFieldProps) {
  return (
    <FormField
      control={form.control}
      name="gridSize"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4" />
            Grid Size
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              min={3}
              max={5}
              {...field}
              onChange={e => field.onChange(Number(e.target.value))}
              value={field.value || 3}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
