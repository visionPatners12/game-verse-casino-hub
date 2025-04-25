
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { betFormSchema, type BetFormSchema } from "../schemas/betFormSchema";
import type { CreateDuoBetDialogProps } from "../types";

interface BetFormProps {
  defaultTeams?: CreateDuoBetDialogProps['defaultTeams'];
  onSubmit: (values: BetFormSchema) => Promise<void>;
  isSubmitting: boolean;
}

export function BetForm({ defaultTeams, onSubmit, isSubmitting }: BetFormProps) {
  const form = useForm<BetFormSchema>({
    resolver: zodResolver(betFormSchema),
    defaultValues: {
      amount: 10,
      team_a: defaultTeams?.teamA || "",
      team_b: defaultTeams?.teamB || "",
      match_description: defaultTeams?.description || "",
      creator_prediction: "TeamA",
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="team_a"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Équipe A</FormLabel>
              <FormControl>
                <Input 
                  placeholder="PSG" 
                  {...field} 
                  readOnly={!!defaultTeams}
                  className={defaultTeams ? "bg-muted cursor-not-allowed" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="team_b"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Équipe B</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Real Madrid" 
                  {...field} 
                  readOnly={!!defaultTeams}
                  className={defaultTeams ? "bg-muted cursor-not-allowed" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="match_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description du match</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ligue des Champions - Quart de finale" 
                  {...field} 
                  readOnly={!!defaultTeams}
                  className={defaultTeams ? "bg-muted cursor-not-allowed" : ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Montant</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="1"
                  placeholder="100" 
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
          name="creator_prediction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Votre prédiction</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez votre prédiction" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="TeamA">Victoire Équipe A</SelectItem>
                  <SelectItem value="TeamB">Victoire Équipe B</SelectItem>
                  <SelectItem value="Draw">Match Nul</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Créer le pari
        </Button>
      </form>
    </Form>
  );
}
