
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
          const newState = payload.new as any;
          setGameState(current => ({
            ...current,
            board: newState.board || Array(9).fill(null),
            currentTurn: newState.current_turn,
            winner: newState.winner_id,
            gameState: newState.game_state,
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
      const players = gameSession.game_players.map((player: any) => ({
        id: player.user_id,
        displayName: player.display_name,
        symbol: player.tictactoe_players?.[0]?.symbol || null,
      }));

      setGameState(current => ({
        ...current,
        board: gameSession.board || Array(9).fill(null),
        currentTurn: gameSession.current_turn,
        winner: gameSession.winner_id,
        gameState: gameSession.game_state,
        players,
      }));
    }
  };

  const makeMove = async (index: number) => {
    if (!roomId) return;

    const newBoard = [...gameState.board];
    newBoard[index] = gameState.players.find(p => p.id === gameState.currentTurn)?.symbol || null;

    const { error } = await supabase
      .from('game_sessions')
      .update({
        board: newBoard,
      })
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
