
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface Player {
  id: string;
  name: string;
  avatar?: string;
  color: "red" | "green" | "yellow" | "blue";
  pieces: number[];
}

const Ludo = () => {
  const { toast } = useToast();
  
  // Mock dice state
  const [diceValue, setDiceValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  
  // Mock players data
  const players: Player[] = [
    { id: "player1", name: "Player123", color: "red", pieces: [0, 0, 0, 0] },
    { id: "player2", name: "GamerPro", color: "blue", pieces: [0, 0, 0, 0] },
    { id: "player3", name: "Winner99", color: "green", pieces: [0, 0, 0, 0] },
    { id: "player4", name: "BoardMaster", color: "yellow", pieces: [0, 0, 0, 0] },
  ];
  
  const currentPlayerId = "player1"; // Mock current player
  
  const rollDice = () => {
    setIsRolling(true);
    
    // Simulate dice roll
    setTimeout(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);
      setIsRolling(false);
      
      toast({
        title: "Dice Rolled",
        description: `You rolled a ${newValue}!`,
      });
    }, 1000);
  };
  
  // This is a simplified visual representation of a Ludo board
  // A real implementation would need much more logic for game rules
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="grid grid-cols-2 gap-4">
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
                    style={{ color: player.color }}
                    className="capitalize"
                  >
                    {player.color}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="aspect-square bg-gray-100 border border-border rounded-md overflow-hidden relative">
          {/* Simplified Ludo board layout */}
          <div className="absolute top-0 left-0 w-[40%] h-[40%] bg-red-500 rounded-br-[5%]"></div>
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-green-500 rounded-bl-[5%]"></div>
          <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500 rounded-tr-[5%]"></div>
          <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-yellow-500 rounded-tl-[5%]"></div>
          
          {/* Center area */}
          <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-white grid grid-cols-2 grid-rows-2">
            <div className="bg-red-500 rounded-tl-lg"></div>
            <div className="bg-green-500 rounded-tr-lg"></div>
            <div className="bg-blue-500 rounded-bl-lg"></div>
            <div className="bg-yellow-500 rounded-br-lg"></div>
          </div>
          
          {/* Home areas */}
          <div className="absolute top-[10%] left-[10%] w-[20%] h-[20%] bg-white rounded-lg border-4 border-red-500"></div>
          <div className="absolute top-[10%] right-[10%] w-[20%] h-[20%] bg-white rounded-lg border-4 border-green-500"></div>
          <div className="absolute bottom-[10%] left-[10%] w-[20%] h-[20%] bg-white rounded-lg border-4 border-blue-500"></div>
          <div className="absolute bottom-[10%] right-[10%] w-[20%] h-[20%] bg-white rounded-lg border-4 border-yellow-500"></div>
          
          {/* Paths */}
          <div className="absolute top-[40%] left-0 w-[40%] h-[20%] grid grid-cols-6 border-t border-b border-border">
            {Array(6).fill(null).map((_, i) => (
              <div key={`left-${i}`} className="border-r border-border bg-white"></div>
            ))}
          </div>
          <div className="absolute top-0 left-[40%] w-[20%] h-[40%] grid grid-rows-6 border-l border-r border-border">
            {Array(6).fill(null).map((_, i) => (
              <div key={`top-${i}`} className="border-b border-border bg-white"></div>
            ))}
          </div>
          <div className="absolute top-[40%] right-0 w-[40%] h-[20%] grid grid-cols-6 border-t border-b border-border">
            {Array(6).fill(null).map((_, i) => (
              <div key={`right-${i}`} className="border-l border-border bg-white"></div>
            ))}
          </div>
          <div className="absolute bottom-0 left-[40%] w-[20%] h-[40%] grid grid-rows-6 border-l border-r border-border">
            {Array(6).fill(null).map((_, i) => (
              <div key={`bottom-${i}`} className="border-t border-border bg-white"></div>
            ))}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div
            className={`w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold ${
              isRolling
                ? "animate-spin bg-gradient-to-br from-primary to-accent text-white"
                : "bg-white border-2 border-accent"
            }`}
          >
            {!isRolling && diceValue ? diceValue : ""}
          </div>
          <Button onClick={rollDice} disabled={isRolling}>
            {isRolling ? "Rolling..." : "Roll Dice"}
          </Button>
        </div>
        
        <div>
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
      </CardFooter>
    </Card>
  );
};

export default Ludo;
