
import { z } from "zod";

export const createRoomSchema = z.object({
  bet: z.number().min(0, "Bet amount must be positive"),
  _gameType: z.string().optional(),
  maxPlayers: z.number().optional(),
  winnerCount: z.number().optional(),
  gridSize: z.number().optional(),
  halfLengthMinutes: z.number().optional(),
  platform: z.enum(['ps5', 'xbox_series', 'cross_play']).optional(),
  mode: z.enum(['online_friendlies', 'fut']).optional(),
  teamType: z.enum(['any_teams', '85_rated', 'country', 'fut_team']).optional(),
  legacyDefending: z.boolean().optional(),
  customFormations: z.boolean().optional()
});

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
