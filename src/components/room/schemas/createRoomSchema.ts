
import { z } from "zod";

export const createRoomSchema = z.object({
  bet: z.number().min(0, "Bet amount must be positive"),
  maxPlayers: z.number().min(2, "Must have at least 2 players"),
  winnerCount: z.number().min(1, "Must have at least 1 winner"),
  gridSize: z.number().optional(),
  matchDuration: z.number().min(1, "La durée doit être au moins de 1 minute").optional(),
  eaId: z.string().min(3, "EA-ID obligatoire pour FUT").optional()
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
