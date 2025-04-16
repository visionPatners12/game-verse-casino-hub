
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
  
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [board, setBoard] = useState<Array<"X" | "O" | null>>(Array(9).fill(null));
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  
  // Get current player based on index
  const currentPlayer = players[currentPlayerIndex];
  
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

  // Check for draw
  const checkDraw = (boardState: Array<"X" | "O" | null>): boolean => {
    return boardState.every(cell => cell !== null) && !checkWinner(boardState);
  };
  
  const handleCellClick = (index: number) => {
    // Don't allow moves if cell is filled, there's a winner, or it's a draw
    if (board[index] || winner || isDraw) return;
    
    // Create new board with the move
    const newBoard = [...board];
    newBoard[index] = currentPlayer.symbol;
    setBoard(newBoard);
    
    // Check for winner
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      const winningPlayer = players.find((p) => p.symbol === gameWinner) || null;
      setWinner(winningPlayer);
      
      toast({
        title: "Game Over!",
        description: `${winningPlayer?.name} wins!`,
      });
      return;
    }
    
    // Check for draw
    if (checkDraw(newBoard)) {
      setIsDraw(true);
      toast({
        title: "Game Over!",
        description: "It's a draw!",
      });
      return;
    }
    
    // Switch to next player
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
  };
  
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setIsDraw(false);
    setCurrentPlayerIndex(0);
  };
  
  // Status message
  const getStatusMessage = () => {
    if (winner) return `${winner.name} Wins!`;
    if (isDraw) return "It's a Draw!";
    return `${currentPlayer.name}'s Turn (${currentPlayer.symbol})`;
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex gap-4">
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={player.avatar} alt={player.name} />
                  <AvatarFallback>{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{player.name}</div>
                  <Badge variant={currentPlayer.id === player.id ? "default" : "outline"}>
                    {player.symbol}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="text-center mb-4">
          <p className="text-lg font-medium">{getStatusMessage()}</p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 aspect-square">
          {board.map((cell, index) => (
            <button
              key={index}
              className={`flex items-center justify-center text-4xl font-bold h-full ${
                cell 
                  ? "cursor-not-allowed" 
                  : winner || isDraw 
                    ? "cursor-not-allowed" 
                    : "cursor-pointer hover:bg-primary/10"
              } border border-border rounded-md transition-colors ${
                winner && cell === winner.symbol ? "bg-accent/20" : ""
              }`}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!winner || isDraw}
              aria-label={`Cell ${index + 1}, ${cell || "empty"}`}
            >
              {cell}
            </button>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          {!winner && !isDraw && "Click on a cell to place your symbol"}
        </div>
        <Button onClick={resetGame}>Reset Game</Button>
      </CardFooter>
    </Card>
  );
};

export default TicTacToe;

