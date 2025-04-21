
export interface GameData {
  currentPlayerId: string | null;
  allPlayers: Array<{
    id: string;
    display_name: string;
    user_id: string;
    ea_id?: string;
    current_score: number;
  }>;
  gameParams: {
    gameType: string;
    betAmount: number;
    maxPlayers: number;
    currentPlayers: number;
    roomId: string;
    totalPot: number;
    matchDuration?: number;
  };
}
