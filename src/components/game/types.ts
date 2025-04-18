
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
    is_ready?: boolean;
    users?: {
      username: string;
      avatar_url?: string;
    };
  }[];
}

// Define the session status type to match the database enum
export type SessionStatus = 'Waiting' | 'Active' | 'Finished';

// Define the presence data type for type safety
export interface PresenceData {
  user_id: string;
  online_at: string;
  is_ready: boolean;
}

// Additional type for database enum values for game session status
export type DatabaseSessionStatus = 'Waiting' | 'Playing' | 'Completed';
