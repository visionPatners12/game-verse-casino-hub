
import { z } from "zod";

export const createRoomSchema = z.object({
  bet: z.number().min(0, "Bet amount must be positive"),
  maxPlayers: z.number().min(2, "Must have at least 2 players"),
  winnerCount: z.number().min(1, "Must have at least 1 winner"),
  gridSize: z.number().optional(),
  matchDuration: z.number()
    .min(1, "La durée doit être au moins de 1 minute")
    .max(60, "Maximum 60 minutes")
    .optional(),
  eaId: z.string().optional(),
  legacyDefending: z.boolean().optional(),
  customFormations: z.boolean().optional(),
  teamType: z.enum(['anyTeams', 'clubOnly', 'nationalOnly', '85rated', 'futTeam']).optional(),
  _gameType: z.string().optional()
}).superRefine((data, ctx) => {
  // Only required for futarena
  if (data._gameType === "futarena") {
    if (!data.eaId || data.eaId.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "EA-ID obligatoire pour FUT",
        path: ["eaId"],
      });
    }
    if (!data.matchDuration || data.matchDuration < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La durée doit être au moins de 1 minute",
        path: ["matchDuration"]
      });
    }
  }
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
