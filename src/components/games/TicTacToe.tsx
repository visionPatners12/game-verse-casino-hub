
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Player {
  id: string;
  name: string;
  avatar?: string;
  symbol: "X" | "O";
}

const TicTacToe = () => {
  const { toast } = useToast();
  
  // Mock players data
  const players: Player[] = [
    { id: "player1", name: "Player123", symbol: "X" },
    { id: "player2", name: "GamerPro", symbol: "O" },
  ];
  
  const currentPlayerId = "player1"; // Mock current player
  
  // Initialize empty board (3x3 grid)
  const [board, setBoard] = useState<Array<"X" | "O" | null>>(Array(9).fill(null));
  const [winner, setWinner] = useState<Player | null>(null);
  
  const checkWinner = (boardState: Array<"X" | "O" | null>): "X" | "O" | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return boardState[a] as "X" | "O";
      }
    }
    
    return null;
  };
  
  const handleCellClick = (index: number) => {
    if (board[index] || winner) return;
    
    const currentPlayer = players.find((p) => p.id === currentPlayerId);
    if (!currentPlayer) return;
    
    const newBoard = [...board];
    newBoard[index] = currentPlayer.symbol;
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      const winningPlayer = players.find((p) => p.symbol === gameWinner) || null;
      setWinner(winningPlayer);
      
      toast({
        title: "Game Over!",
        description: `${winningPlayer?.name} wins!`,
      });
    }
  };
  
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex gap-4">
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={player.avatar} />
                  <AvatarFallback>{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{player.name}</div>
                  <Badge variant="outline">{player.symbol}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-2 aspect-square">
          {board.map((cell, index) => (
            <button
              key={index}
              className={`flex items-center justify-center text-4xl font-bold h-full ${
                cell ? "cursor-not-allowed" : "cursor-pointer hover:bg-primary/10"
              } border border-border rounded-md transition-colors`}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>
        
        {winner && (
          <div className="mt-4 text-center">
            <div className="text-xl font-bold text-accent">
              {winner.name} Wins!
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button onClick={resetGame}>Reset Game</Button>
      </CardFooter>
    </Card>
  );
};

export default TicTacToe;
