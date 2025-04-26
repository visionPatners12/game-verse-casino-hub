
export type GamePlatform = 'ps5' | 'xbox_series' | 'cross_play';
export type GameMode = 'online_friendlies' | 'fut';
export type TeamType = 'any_teams' | '85_rated' | 'country' | 'fut_team';

export interface FutArenaGameSession {
  platform: GamePlatform;
  mode: GameMode;
  team_type: TeamType;
  legacy_defending_allowed: boolean;
  custom_formations_allowed: boolean;
}
