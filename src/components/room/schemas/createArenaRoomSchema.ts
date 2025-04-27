
import { z } from "zod";

export const createArenaRoomSchema = z.object({
  bet: z.number().min(0),
  maxPlayers: z.number().min(2),
  winnerCount: z.number().optional(),
  gridSize: z.number().optional(),
  halfLengthMinutes: z.number().optional(),
  platform: z.enum(["ps5", "xbox_series", "cross_play"]),
  mode: z.enum(["online_friendlies", "fut"]),
  teamType: z.enum(["any_teams", "85_rated", "country", "fut_team"]),
  legacyDefending: z.boolean(),
  customFormations: z.boolean(),
  _gameType: z.string().optional(),
  gamerTag: z.string().min(1, "Gamer tag is required"),
});

export type CreateArenaRoomFormData = z.infer<typeof createArenaRoomSchema>;
