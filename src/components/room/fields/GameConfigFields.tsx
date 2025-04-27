
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Timer } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { CreateArenaRoomFormData } from "../schemas/createArenaRoomSchema";

interface GameConfigFieldsProps {
  form: UseFormReturn<CreateArenaRoomFormData>;
}

export const GameConfigFields = ({ form }: GameConfigFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="halfLengthMinutes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              Durée mi-temps (minutes)
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={45}
                {...field}
                onChange={e => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="legacyDefending"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Legacy Defending</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customFormations"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Formations personnalisées</FormLabel>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
