
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
  cardCount: number;
}

type CardColor = "red" | "blue" | "green" | "yellow" | "wild";
type CardValue = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "skip" | "reverse" | "draw2" | "wild" | "draw4";

interface GameCard {
  id: string;
  color: CardColor;
  value: CardValue;
}

const CheckGame = () => {
  const { toast } = useToast();
  
  // Mock players data
  const players: Player[] = [
    { id: "player1", name: "Player123", cardCount: 7 },
    { id: "player2", name: "GamerPro", cardCount: 4 },
    { id: "player3", name: "Winner99", cardCount: 9 },
    { id: "player4", name: "BoardMaster", cardCount: 2 },
  ];
  
  const currentPlayerId = "player1"; // Mock current player
  
  // Mock top card - in a real game this would come from the game state
  const [topCard, setTopCard] = useState<GameCard>({
    id: "card-top",
    color: "red",
    value: "5",
  });
  
  // Simplified mock player hand
  const [playerHand, setPlayerHand] = useState<GameCard[]>([
    { id: "card1", color: "red", value: "3" },
    { id: "card2", color: "blue", value: "7" },
    { id: "card3", color: "green", value: "skip" },
    { id: "card4", color: "red", value: "reverse" },
    { id: "card5", color: "yellow", value: "1" },
    { id: "card6", color: "blue", value: "4" },
    { id: "card7", color: "red", value: "9" },
  ]);
  
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  
  const playCard = () => {
    if (!selectedCard) return;
    
    const card = playerHand.find((c) => c.id === selectedCard);
    if (!card) return;
    
    // Check if card can be played (same color or value)
    if (card.color === topCard.color || card.value === topCard.value || card.color === "wild") {
      // Remove card from hand
      setPlayerHand(playerHand.filter((c) => c.id !== selectedCard));
      
      // Set as new top card
      setTopCard(card);
      
      setSelectedCard(null);
      
      toast({
        title: "Card Played",
        description: `You played a ${card.color} ${card.value}`,
      });
      
      // Check if player won
      if (playerHand.length === 1) {
        toast({
          title: "UNO!",
          description: "You have only one card left!",
        });
      } else if (playerHand.length === 0) {
        toast({
          title: "Winner!",
          description: "You have played all your cards!",
        });
      }
    } else {
      toast({
        title: "Invalid Move",
        description: "This card cannot be played on the current top card",
        variant: "destructive",
      });
    }
  };
  
  const drawCard = () => {
    // In a real game, this would come from the deck
    const newCard: GameCard = {
      id: `card-${Date.now()}`,
      color: ["red", "blue", "green", "yellow"][Math.floor(Math.random() * 4)] as CardColor,
      value: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"][
        Math.floor(Math.random() * 10)
      ] as CardValue,
    };
    
    setPlayerHand([...playerHand, newCard]);
    
    toast({
      title: "Card Drawn",
      description: `You drew a ${newCard.color} ${newCard.value}`,
    });
  };
  
  const getColorClass = (color: CardColor) => {
    switch (color) {
      case "red":
        return "bg-red-500";
      case "blue":
        return "bg-blue-500";
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {players.map((player) => (
              <div key={player.id} className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={player.avatar} />
                  <AvatarFallback>{player.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{player.name}</div>
                  <Badge variant="outline">
                    {player.cardCount} card{player.cardCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-center mb-6">
          <div
            className={`w-24 h-36 rounded-lg ${getColorClass(
              topCard.color
            )} text-white font-bold flex items-center justify-center text-3xl shadow-lg`}
          >
            {topCard.value}
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {playerHand.map((card) => (
            <button
              key={card.id}
              className={`w-16 h-24 sm:w-20 sm:h-28 rounded-lg ${getColorClass(
                card.color
              )} text-white font-bold flex items-center justify-center text-xl shadow transition-transform ${
                selectedCard === card.id
                  ? "transform -translate-y-4 ring-2 ring-accent"
                  : "hover:-translate-y-2"
              }`}
              onClick={() => setSelectedCard(card.id === selectedCard ? null : card.id)}
            >
              {card.value}
            </button>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button onClick={playCard} disabled={!selectedCard}>
            Play Card
          </Button>
          <Button variant="outline" onClick={drawCard}>
            Draw Card
          </Button>
        </div>
        
        <div>
          <Button
            onClick={() => {
              toast({
                title: "Said UNO!",
                description: "You called UNO!",
              });
            }}
            variant="destructive"
          >
            UNO!
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CheckGame;
