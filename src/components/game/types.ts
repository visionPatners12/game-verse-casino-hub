
export interface User {
  id: string;
  username: string;
  avatar_url: string | null;
  email: string;
}

export interface PresenceData {
  user_id: string;
  online_at: string;
  is_ready?: boolean;
  [key: string]: any;
}

export interface GamePlayer {
  id: string;
  display_name: string;
  user_id: string;
  session_id: string;
  current_score: number | null;
  is_connected: boolean;
  is_ready: boolean;
  has_submitted_score: boolean;
  has_submitted_proof: boolean;
  created_at: string;
  updated_at: string;
  users?: {
    username: string;
    avatar_url: string | null;
  } | null;
  ea_id?: string;
}

export type DatabaseSessionStatus = 'Waiting' | 'Active' | 'Finished' | 'Canceled';

// Add or update the RoomData type to include EAFC25 specific fields
export interface RoomData {
  id: string;
  game_type: string;
  room_id: string;
  max_players: number;
  current_players: number;
  entry_fee: number;
  pot: number;
  commission_rate: number;
  status: string;
  start_time: string | null;
  end_time: string | null;
  game_players: GamePlayer[];
  connected_players?: string[];
  room_type: string;
  created_at: string;
  updated_at: string;
  
  // EAFC25 specific fields from arena_game_sessions
  platform?: string;
  mode?: string;
  team_type?: string;
  half_length_minutes?: number;
  legacy_defending_allowed?: boolean;
  custom_formations_allowed?: boolean;
  ea_id?: string;
}
