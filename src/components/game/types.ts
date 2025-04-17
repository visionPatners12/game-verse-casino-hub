
export interface RoomData {
  id: string;
  game_type: string;
  max_players: number;
  current_players: number;
  room_type: string;
  entry_fee: number;
  commission_rate: number;
  room_id: string;
  pot: number;
  status: string;
  created_at: string;
  game_players: {
    id: string;
    display_name: string;
    user_id: string;
    current_score: number;
  }[];
}
