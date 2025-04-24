
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useDuoBets } from "@/hooks/useDuoBets";
import { Loader2, Plus } from "lucide-react";

const formSchema = z.object({
  amount: z.number().min(1, "Le montant doit être supérieur à 0"),
  team_a: z.string().min(1, "L'équipe A est requise"),
  team_b: z.string().min(1, "L'équipe B est requise"),
  match_description: z.string().min(3, "La description doit contenir au moins 3 caractères"),
  creator_prediction: z.enum(["TeamA", "TeamB", "Draw"]),
  expires_at: z.string().min(1, "La date d'expiration est requise"),
});

export function CreateDuoBetDialog() {
  const [open, setOpen] = useState(false);
  const { createBet } = useDuoBets();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      team_a: "",
      team_b: "",
      match_description: "",
      creator_prediction: "TeamA",
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createBet.mutateAsync(values);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Pari Duo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un pari duo</DialogTitle>
          <DialogDescription>
            Proposez un pari à un autre utilisateur sur l'issue d'un match.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="team_a"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Équipe A</FormLabel>
                  <FormControl>
                    <Input placeholder="PSG" {...field} />
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
                    <Input placeholder="Real Madrid" {...field} />
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
                    <Input placeholder="Ligue des Champions - Quart de finale" {...field} />
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
            <Button type="submit" disabled={createBet.isPending}>
              {createBet.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Créer le pari
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
