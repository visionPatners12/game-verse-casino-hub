
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateArenaRoomFormData } from "../schemas/createArenaRoomSchema";

interface PlatformFieldProps {
  form: UseFormReturn<CreateArenaRoomFormData>;
}

export const PlatformField = ({ form }: PlatformFieldProps) => {
  return (
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
  );
}
