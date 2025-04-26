
import { z } from "zod";

export const createRoomSchema = z.object({
  bet: z.number().min(0, "Bet amount must be positive"),
  maxPlayers: z.number().min(2, "Must have at least 2 players"),
  winnerCount: z.number().min(1, "Must have at least 1 winner"),
  _gameType: z.string().optional()
}).superRefine((data, ctx) => {
  // Optional game-specific validations can be added here if needed
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
