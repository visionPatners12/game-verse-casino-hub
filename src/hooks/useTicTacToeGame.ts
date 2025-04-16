
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Updated interfaces to match database schema
interface GameSession {
  id: string;
  commission_rate: number;
  created_at: string;
  current_players: number;
  end_time: string | null;
  entry_fee: number;
  game_type: "Ludo" | "Checkers" | "TicTacToe" | "CheckGame";
  max_players: number;
  pot: number;
  room_id: string | null;
  room_type: "public" | "private";
  start_time: string | null;
  status: "Waiting" | "Active" | "Finished";
  updated_at: string;
  // Properties added in SQL migration
  board: Array<string | null> | null;
  current_turn: string | null;
  winner_id: string | null;
  game_state: 'waiting' | 'playing' | 'finished' | null;
  game_players?: GamePlayer[];
}

interface GamePlayer {
  id: string;
  user_id: string;
  display_name: string;
  session_id: string;
  is_connected: boolean | null;
  tictactoe_players?: {
    symbol: "X" | "O";
  }[];
}

interface GameState {
  board: Array<"X" | "O" | null>;
  currentTurn: string | null;
  winner: string | null;
  gameState: 'waiting' | 'playing' | 'finished';
  players: Array<{
    id: string;
    displayName: string;
    symbol: "X" | "O";
  }>;
}

export const useTicTacToeGame = () => {
  const { roomId } = useParams();
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentTurn: null,
    winner: null,
    gameState: 'waiting',
    players: [],
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!roomId) return;

    // Subscribe to game changes
    const channel = supabase
      .channel(`game:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${roomId}`,
        },
        (payload) => {
          const newState = payload.new as GameSession;
          setGameState(current => ({
            ...current,
            board: (newState.board as Array<string | null>) || Array(9).fill(null),
            currentTurn: newState.current_turn,
            winner: newState.winner_id,
            gameState: newState.game_state || 'waiting',
          }));
        }
      )
      .subscribe();

    // Initial game state fetch
    fetchGameState();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const fetchGameState = async () => {
    if (!roomId) return;

    const { data: gameSession, error: gameError } = await supabase
      .from('game_sessions')
      .select(`
        *,
        game_players (
          id,
          user_id,
          display_name,
          tictactoe_players (symbol)
        )
      `)
      .eq('id', roomId)
      .single();

    if (gameError) {
      toast({
        title: "Error",
        description: "Failed to load game state",
        variant: "destructive",
      });
      return;
    }

    if (gameSession) {
      // Cast the gameSession to our interface type
      const typedSession = gameSession as unknown as GameSession;
      
      const players = typedSession.game_players?.map((player) => ({
        id: player.user_id,
        displayName: player.display_name,
        symbol: player.tictactoe_players?.[0]?.symbol as "X" | "O" || null,
      })) || [];

      setGameState(current => ({
        ...current,
        board: (typedSession.board as Array<string | null>) || Array(9).fill(null),
        currentTurn: typedSession.current_turn,
        winner: typedSession.winner_id,
        gameState: typedSession.game_state || 'waiting',
        players,
      }));
    }
  };

  const makeMove = async (index: number) => {
    if (!roomId) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.players.find(p => p.id === gameState.currentTurn)?.symbol || null;

    // Use the Database.TableName.Update type for the update
    const { error } = await supabase
      .from('game_sessions')
      .update({
        board: newBoard,
      } as any)  // Using 'as any' to bypass TypeScript constraint temporarily
      .eq('id', roomId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to make move",
        variant: "destructive",
      });
    }
  };

  return {
    gameState,
    makeMove,
  };
};
