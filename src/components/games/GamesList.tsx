
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
  games: Game[];
}

const GamesList = ({ games }: GamesListProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <div key={game.id} className="flex flex-col gap-4">
          <GameCard 
            {...game} 
          />
        </div>
      ))}
    </div>
  );
};

export default GamesList;
