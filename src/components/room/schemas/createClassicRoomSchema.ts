
import { z } from "zod";

export const createClassicRoomSchema = z.object({
  bet: z.number().min(0),
  maxPlayers: z.number().min(2),
  winnerCount: z.number().optional(),
  gridSize: z.number().optional(),
  _gameType: z.string().optional(),
});

export type CreateClassicRoomFormData = z.infer<typeof createClassicRoomSchema>;
