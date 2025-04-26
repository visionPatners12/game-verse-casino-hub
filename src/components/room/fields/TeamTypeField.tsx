
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CreateRoomFormData } from "../schemas/createRoomSchema";

interface TeamTypeFieldProps {
  form: UseFormReturn<CreateRoomFormData>;
}

export const TeamTypeField = ({ form }: TeamTypeFieldProps) => {
  return (
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
  );
};
