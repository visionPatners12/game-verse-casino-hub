
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

// Sample games data since it's no longer passed as a prop
const games: Game[] = [
  {
    id: "1",
    name: "Ludo",
    description: "A classic board game where players race their four tokens from start to finish.",
    image: "/placeholder.svg",
    type: "ludo",
    players: {
      min: 2,
      max: 4
    }
  },
  {
    id: "2",
    name: "Checkers",
    description: "Strategic board game for two players involving diagonal moves and captures.",
    image: "/placeholder.svg",
    type: "checkers",
    players: {
      min: 2,
      max: 2
    }
  },
  {
    id: "3",
    name: "Tic Tac Toe",
    description: "Simple game of X's and O's where the first to get 3 in a row wins.",
    image: "/placeholder.svg",
    type: "tictactoe",
    players: {
      min: 2,
      max: 2
    }
  },
  {
    id: "4",
    name: "CheckGame",
    description: "A strategic card game with unique rules and challenges.",
    image: "/placeholder.svg",
    type: "checkgame",
    players: {
      min: 2,
      max: 4
    }
  },
  {
    id: "5",
    name: "FutArena",
    description: "Virtual football match simulation based on your EA ID.",
    image: "/placeholder.svg",
    type: "futarena",
    players: {
      min: 2,
      max: 2
    }
  }
];

const GamesList = ({ onGameSelect }: GamesListProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
