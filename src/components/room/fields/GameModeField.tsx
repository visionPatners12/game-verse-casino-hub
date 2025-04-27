
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateArenaRoomFormData } from "../schemas/createArenaRoomSchema";

interface GameModeFieldProps {
  form: UseFormReturn<CreateArenaRoomFormData>;
}

export const GameModeField = ({ form }: GameModeFieldProps) => {
  return (
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
  );
}
