
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GameCard, { GameType } from "@/components/GameCard";

const Games = () => {
  const navigate = useNavigate();
  
  // Mock games data
  const games = [
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Games</h1>
          <Button 
            onClick={() => navigate("/games/join")}
            className="ml-auto"
          >
            Join a Game
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <div key={game.id} className="flex flex-col gap-4">
              <GameCard 
                {...game} 
                onPublicRoomClick={() => navigate(`/games/${game.type}/public`)}
                onCreateRoomClick={() => navigate(`/games/${game.type}/create`)}
              />
            </div>
          ))}
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GameVerse Casino. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Games;
