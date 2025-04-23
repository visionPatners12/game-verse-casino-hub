
import { useNavigate } from "react-router-dom";
import GameCard, { GameType } from "@/components/GameCard";

interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  type: GameType;
  players?: {
    min: number;
    max: number;
  };
}

interface GamesListProps {
  onGameSelect: (gameType: string) => void;  // Updated to match the new prop
}

const GamesList = ({ onGameSelect }: GamesListProps) => {
  const navigate = useNavigate();
  
  // Modify the rendering to use onGameSelect
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Assuming you want to pass the game type when selecting */}
      {games.map((game) => (
        <div key={game.id} className="flex flex-col gap-4">
          <GameCard 
            {...game}
            onClick={() => onGameSelect(game.type)}  // Added onClick handler
          />
        </div>
      ))}
    </div>
  );
};

export default GamesList;  // Ensuring default export
