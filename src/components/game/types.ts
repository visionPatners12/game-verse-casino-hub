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
  connected_players: string[];
  game_players: {
    id: string;
    display_name: string;
    user_id: string;
    current_score: number;
    is_connected: boolean;
    is_ready: boolean;
    users?: {
      username: string;
      avatar_url?: string;
    };
  }[];
}

export type SessionStatus = 'Waiting' | 'Playing' | 'Finished';

export interface PresenceData {
  user_id: string;
  online_at: string;
  is_ready: boolean;
}

export type DatabaseSessionStatus = 'Waiting' | 'Active' | 'Finished';
