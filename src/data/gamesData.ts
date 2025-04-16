
import { GameType } from "@/components/GameCard";

export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  type: GameType;
  players: {
    min: number;
    max: number;
  };
}

export const games: Game[] = [
  {
    id: "1",
    name: "Ludo",
    description: "Classic Ludo board game for 2-4 players. Roll the dice and race to the finish!",
    image: "https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3",
    type: "ludo" as GameType,
    players: {
      min: 2,
      max: 4,
    },
  },
  {
    id: "2",
    name: "Checkers",
    description: "Traditional 2-player strategy board game. Capture all your opponent's pieces!",
    image: "https://plus.unsplash.com/premium_photo-1677568610596-8e759315764a?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3",
    type: "checkers" as GameType,
    players: {
      min: 2,
      max: 2,
    },
  },
  {
    id: "3",
    name: "Tic-Tac-Toe",
    description: "Simple but fun 2-player game. Be the first to get three in a row!",
    image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    type: "tictactoe" as GameType,
    players: {
      min: 2,
      max: 2,
    },
  },
  {
    id: "4",
    name: "CheckGame",
    description: "Fast-paced UNO-style card game for 2-6 players. Match colors and numbers!",
    image: "https://images.unsplash.com/photo-1600077106724-946750eeaf3c?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3",
    type: "checkgame" as GameType,
    players: {
      min: 2,
      max: 6,
    },
  },
];
