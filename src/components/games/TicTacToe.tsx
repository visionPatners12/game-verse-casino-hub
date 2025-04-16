
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTicTacToeGame } from "@/hooks/useTicTacToeGame";
import { Loader2 } from "lucide-react";

const TicTacToe = () => {
  const { gameState, makeMove } = useTicTacToeGame();
  
  const handleCellClick = (index: number) => {
    if (gameState.board[index] || gameState.winner) return;
    makeMove(index);
  };

  if (gameState.gameState === 'waiting') {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Waiting for players...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex gap-4">
            {gameState.players.map((player) => (
              <div key={player.id} className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>{player.displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{player.displayName}</div>
                  <Badge variant="outline">{player.symbol}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-3 gap-2 aspect-square">
          {gameState.board.map((cell, index) => (
            <button
              key={index}
              className={`flex items-center justify-center text-4xl font-bold h-full ${
                cell ? "cursor-not-allowed" : "cursor-pointer hover:bg-primary/10"
              } border border-border rounded-md transition-colors`}
              onClick={() => handleCellClick(index)}
              disabled={!!cell || !!gameState.winner || gameState.currentTurn !== gameState.players.find(p => p.id === gameState.currentTurn)?.id}
            >
              {cell}
            </button>
          ))}
        </div>
        
        {gameState.winner && (
          <div className="mt-4 text-center">
            <div className="text-xl font-bold text-accent">
              {gameState.players.find(p => p.id === gameState.winner)?.displayName} Wins!
            </div>
          </div>
        )}
      </CardContent>
      
      {gameState.winner && (
        <CardFooter className="flex justify-end">
          <Button onClick={() => window.location.reload()}>New Game</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default TicTacToe;
