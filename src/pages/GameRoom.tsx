
import { useState } from "react";
import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import TicTacToe from "@/components/games/TicTacToe";
import Checkers from "@/components/games/Checkers";
import Ludo from "@/components/games/Ludo";
import CheckGame from "@/components/games/CheckGame";
import GameChat from "@/components/GameChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameType } from "@/components/GameCard";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Share2, ExternalLink, DollarSign } from "lucide-react";

const GameRoom = () => {
  const { gameType, roomId } = useParams<{ gameType: GameType; roomId: string }>();
  const { toast } = useToast();
  
  // Mock room data - would fetch from API based on roomId
  const [roomData] = useState({
    id: roomId || "unknown",
    gameType: gameType || "tictactoe",
    gameName: gameType ? gameType.charAt(0).toUpperCase() + gameType.slice(1) : "Unknown Game",
    bet: 25,
    maxPlayers: gameType === "ludo" ? 4 : gameType === "checkgame" ? 6 : 2,
    currentPlayers: 2,
    isPrivate: false,
    createdBy: "Player123",
    winnerCount: 1,
  });
  
  // Render the appropriate game component based on gameType
  const renderGameComponent = () => {
    switch (gameType) {
      case "tictactoe":
        return <TicTacToe />;
      case "checkers":
        return <Checkers />;
      case "ludo":
        return <Ludo />;
      case "checkgame":
        return <CheckGame />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Game not found</h3>
            <p className="text-muted-foreground">
              The requested game type does not exist
            </p>
          </div>
        );
    }
  };
  
  const copyRoomLink = () => {
    const roomUrl = `${window.location.origin}/games/${gameType}/room/${roomId}`;
    navigator.clipboard.writeText(roomUrl);
    
    toast({
      title: "Link Copied",
      description: "Room link copied to clipboard!",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="w-full lg:w-2/3">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    {roomData.gameName} Room
                    <span className="text-sm font-normal text-muted-foreground">
                      (ID: {roomData.id})
                    </span>
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    {roomData.isPrivate && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={copyRoomLink}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="hidden sm:inline">Copy Link</span>
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        toast({
                          title: "Sharing",
                          description: "Opening share dialog",
                        });
                      }}
                    >
                      <Share2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => {
                        toast({
                          title: "Opening in New Window",
                          description: "Game opened in fullscreen mode",
                        });
                      }}
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden sm:inline">Fullscreen</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4 p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <div>
                      <div className="text-sm font-medium">Bet Amount</div>
                      <div className="text-xl font-semibold">${roomData.bet}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-right">Winner Takes</div>
                    <div className="text-xl font-semibold text-accent">
                      ${roomData.bet * roomData.currentPlayers}
                    </div>
                  </div>
                </div>
                
                {renderGameComponent()}
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full lg:w-1/3">
            <GameChat />
          </div>
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

export default GameRoom;
