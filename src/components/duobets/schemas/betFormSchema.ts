
import * as z from "zod";

export const betFormSchema = z.object({
  amount: z.number().min(1, "Le montant doit être supérieur à 0"),
  team_a: z.string().min(1, "L'équipe A est requise"),
  team_b: z.string().min(1, "L'équipe B est requise"),
  match_description: z.string().min(3, "La description doit contenir au moins 3 caractères"),
  creator_prediction: z.enum(["TeamA", "TeamB", "Draw"]),
  expires_at: z.string().min(1, "La date d'expiration est requise"),
});

export type BetFormSchema = z.infer<typeof betFormSchema>;
