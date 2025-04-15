
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GameCard, GameType } from "@/components/GameCard";
import RoomCard from "@/components/RoomCard";
import { Search, Users, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const Games = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
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
  
  // Mock rooms data
  const rooms = [
    {
      id: "room1",
      gameType: "ludo" as GameType,
      gameName: "Ludo",
      bet: 25,
      maxPlayers: 4,
      currentPlayers: 1,
      isPrivate: false,
      createdBy: "Player123",
      winnerCount: 1,
    },
    {
      id: "room2",
      gameType: "tictactoe" as GameType,
      gameName: "Tic-Tac-Toe",
      bet: 10,
      maxPlayers: 2,
      currentPlayers: 1,
      isPrivate: false,
      createdBy: "GamerPro",
      winnerCount: 1,
    },
    {
      id: "room3",
      gameType: "checkers" as GameType,
      gameName: "Checkers",
      bet: 50,
      maxPlayers: 2,
      currentPlayers: 1,
      isPrivate: false,
      createdBy: "Winner99",
      winnerCount: 1,
    },
    {
      id: "room4",
      gameType: "checkgame" as GameType,
      gameName: "CheckGame",
      bet: 30,
      maxPlayers: 4,
      currentPlayers: 2,
      isPrivate: false,
      createdBy: "BoardMaster",
      winnerCount: 2,
    },
    {
      id: "room5",
      gameType: "ludo" as GameType,
      gameName: "Ludo",
      bet: 15,
      maxPlayers: 4,
      currentPlayers: 3,
      isPrivate: true,
      createdBy: "LudoKing",
      winnerCount: 1,
    },
    {
      id: "room6",
      gameType: "checkgame" as GameType,
      gameName: "CheckGame",
      bet: 40,
      maxPlayers: 6,
      currentPlayers: 3,
      isPrivate: false,
      createdBy: "CardMaster",
      winnerCount: 3,
    },
  ];
  
  // Filter rooms based on search query
  const filteredRooms = rooms.filter(
    (room) =>
      room.gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Games</h1>
          <Button>Create Private Room</Button>
        </div>
        
        <Tabs defaultValue="join" className="mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="join">Join Game</TabsTrigger>
              <TabsTrigger value="browse">Browse Games</TabsTrigger>
            </TabsList>
            
            <div className="flex w-full sm:w-auto gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search rooms or players..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuGroup>
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Game Type</p>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Games" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Games</SelectItem>
                          <SelectItem value="ludo">Ludo</SelectItem>
                          <SelectItem value="checkers">Checkers</SelectItem>
                          <SelectItem value="tictactoe">Tic-Tac-Toe</SelectItem>
                          <SelectItem value="checkgame">CheckGame</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Bet Amount</p>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Any Bet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Any Bet</SelectItem>
                          <SelectItem value="low">Low ($1-$25)</SelectItem>
                          <SelectItem value="medium">Medium ($25-$50)</SelectItem>
                          <SelectItem value="high">High ($50+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Room Type</p>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Rooms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Rooms</SelectItem>
                          <SelectItem value="public">Public Only</SelectItem>
                          <SelectItem value="private">Private Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <DropdownMenuItem asChild>
                      <Button className="w-full mt-2">Apply Filters</Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <TabsContent value="join">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} {...room} />
              ))}
            </div>
            
            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No rooms found</h3>
                <p className="text-muted-foreground mb-6">
                  No game rooms match your search criteria
                </p>
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="browse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <GameCard key={game.id} {...game} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
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
