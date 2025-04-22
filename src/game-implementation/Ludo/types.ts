
export interface GameData {
  currentPlayerId: string | null;
  allPlayers: PlayerData[];
  gameParams: GameParams;
}

export interface PlayerData {
  id: string;
  display_name: string;
  user_id: string;
  current_score: number;
  ea_id: string;
}

export interface GameParams {
  gameType: string;
  betAmount: number;
  maxPlayers: number;
  currentPlayers: number;
  roomId: string;
  totalPot: number;
  matchDuration?: number;
}
