
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Player {
  id: string;
  name: string;
  avatar?: string;
  color: "red" | "black";
}

const Checkers = () => {
  const { toast } = useToast();
  const boardSize = 8;
  
  // Mock players data
  const players: Player[] = [
    { id: "player1", name: "Player123", color: "red" },
    { id: "player2", name: "GamerPro", color: "black" },
  ];
  
  const currentPlayerId = "player1"; // Mock current player
  
  // Simple board representation for visual demo
  // In a real game, you'd need more complex state tracking for pieces and moves
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  
  const handleCellClick = (row: number, col: number) => {
    const index = row * boardSize + col;
    setSelectedCell(index === selectedCell ? null : index);
    
    // Simulate a move notification
    if (selectedCell !== null && selectedCell !== index) {
      toast({
        title: "Move Made",
        description: `Piece moved from ${Math.floor(selectedCell / boardSize)},${selectedCell % boardSize} to ${row},${col}`,
      });
      setSelectedCell(null);
    }
  };
  
  // Determine if a cell should be dark or light
  const isCellDark = (row: number, col: number) => {
    return (row + col) % 2 === 1;
  };
  
  // Simplified piece placement logic for visual demo
  const getPiece = (row: number, col: number) => {
    if (!isCellDark(row, col)) return null;
    
    if (row < 3) return "black";
    if (row > 4) return "red";
    return null;
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
                  <Badge
                    variant="outline"
                    className={`${
                      player.color === "red" ? "text-red-500" : "text-gray-800"
                    }`}
                  >
                    {player.color.charAt(0).toUpperCase() + player.color.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-8 gap-0 border border-border aspect-square">
          {Array.from({ length: boardSize }).map((_, rowIndex) => (
            Array.from({ length: boardSize }).map((_, colIndex) => {
              const pieceColor = getPiece(rowIndex, colIndex);
              const cellIndex = rowIndex * boardSize + colIndex;
              const isSelected = selectedCell === cellIndex;
              
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`aspect-square flex items-center justify-center ${
                    isCellDark(rowIndex, colIndex) ? "bg-gray-700" : "bg-gray-200"
                  } ${
                    isSelected ? "outline outline-2 outline-accent" : ""
                  }`}
                  onClick={() => isCellDark(rowIndex, colIndex) && handleCellClick(rowIndex, colIndex)}
                >
                  {pieceColor && (
                    <div
                      className={`w-4/5 h-4/5 rounded-full ${
                        pieceColor === "red" ? "bg-red-500" : "bg-gray-900"
                      } shadow-md ${
                        isSelected ? "ring-2 ring-accent" : ""
                      }`}
                    />
                  )}
                </div>
              );
            })
          ))}
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            onClick={() => {
              toast({
                title: "Game Forfeit",
                description: "You have forfeit the game",
              });
            }}
            variant="outline"
          >
            Forfeit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Checkers;
