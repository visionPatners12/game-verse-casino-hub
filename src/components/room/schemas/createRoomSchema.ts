
import { z } from "zod";

export const createRoomSchema = z.object({
  bet: z.number().min(0, "Bet amount must be positive"),
  _gameType: z.string().optional()
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
