
import { z } from "zod";

export const createRoomSchema = z.object({
  bet: z.number().min(0, "Bet amount must be positive"),
  _gameType: z.string().optional(),
  maxPlayers: z.number().optional(),
  winnerCount: z.number().optional(),
  gridSize: z.number().optional(),
  matchDuration: z.number().optional(),
  eaId: z.string().optional(),
  legacyDefending: z.boolean().optional(),
  customFormations: z.boolean().optional(),
  teamType: z.string().optional()
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
