
export interface PlayerData {
  id: string;
  display_name: string;
  user_id: string;
  current_score: number;
}

export interface GameParams {
  gameType: string;
  betAmount: number;
  maxPlayers: number;
  currentPlayers: number;
  roomId: string;
  totalPot: number;
}

export interface GameData {
  currentPlayerId: string | null;
  allPlayers: PlayerData[];
  gameParams: GameParams;
}
