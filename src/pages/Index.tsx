
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import GameCard from "@/components/GameCard";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GamepadIcon, Trophy, Users, Coins } from "lucide-react";
import AuthForms from "@/components/AuthForms";

const Index = () => {
  // Mock games data
  const games = [
    {
      id: "1",
      name: "Ludo",
      description: "Classic Ludo board game for 2-4 players. Roll the dice and race to the finish!",
      image: "https://images.unsplash.com/photo-1585504198199-20277593b94f?auto=format&fit=crop&q=80&w=2787&ixlib=rb-4.0.3",
      type: "ludo" as const,
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
      type: "checkers" as const,
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
      type: "tictactoe" as const,
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
      type: "checkgame" as const,
      players: {
        min: 2,
        max: 6,
      },
    },
  ];
  
  // Mock user state - would come from auth context
  const isLoggedIn = false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {!isLoggedIn ? (
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                  Play, Win, Repeat
                </h1>
                <p className="text-xl text-muted-foreground">
                  Join the ultimate online casino for classic board games. Compete with players worldwide and win big!
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-primary/10">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <GamepadIcon className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">4 Classic Games</h3>
                    <p className="text-sm text-muted-foreground">
                      Ludo, Checkers, Tic-Tac-Toe, CheckGame
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/10">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Trophy className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">Win Real Prizes</h3>
                    <p className="text-sm text-muted-foreground">
                      Place bets and multiply your winnings
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/10">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Users className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">Play with Friends</h3>
                    <p className="text-sm text-muted-foreground">
                      Create private rooms with custom rules
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-primary/10">
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Coins className="h-8 w-8 mb-2 text-primary" />
                    <h3 className="font-medium">Bonus Balance</h3>
                    <p className="text-sm text-muted-foreground">
                      Get extra funds with our referral system
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 shadow-xl border border-border">
              <AuthForms />
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 container mx-auto px-4 py-8">
          <section className="mb-10">
            <h2 className="text-3xl font-bold mb-6">Welcome to GameVerse Casino</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/games">
                <Card className="bg-gradient-to-br from-primary/20 to-primary/5 hover:from-primary/30 hover:to-primary/10 transition-colors h-40">
                  <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <GamepadIcon className="h-10 w-10 mb-3 text-primary" />
                    <h3 className="text-xl font-medium">Play Games</h3>
                    <p className="text-sm text-muted-foreground">
                      Compete in your favorite games
                    </p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/dashboard">
                <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 hover:from-secondary/30 hover:to-secondary/10 transition-colors h-40">
                  <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Trophy className="h-10 w-10 mb-3 text-secondary" />
                    <h3 className="text-xl font-medium">Your Stats</h3>
                    <p className="text-sm text-muted-foreground">
                      View your achievements and history
                    </p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/wallet">
                <Card className="bg-gradient-to-br from-accent/20 to-accent/5 hover:from-accent/30 hover:to-accent/10 transition-colors h-40">
                  <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Coins className="h-10 w-10 mb-3 text-accent" />
                    <h3 className="text-xl font-medium">Manage Wallet</h3>
                    <p className="text-sm text-muted-foreground">
                      Deposit, withdraw, and track transactions
                    </p>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/store">
                <Card className="bg-gradient-to-br from-destructive/20 to-destructive/5 hover:from-destructive/30 hover:to-destructive/10 transition-colors h-40">
                  <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <Users className="h-10 w-10 mb-3 text-destructive" />
                    <h3 className="text-xl font-medium">Visit Store</h3>
                    <p className="text-sm text-muted-foreground">
                      Customize your profile and chat
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>
          
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">Featured Games</h2>
              <Button asChild variant="outline">
                <Link to="/games">View All Games</Link>
              </Button>
            </div>
            
            <Tabs defaultValue="popular">
              <TabsList className="mb-6">
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
              </TabsList>
              
              <TabsContent value="popular" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {games.map((game) => (
                  <GameCard key={game.id} {...game} />
                ))}
              </TabsContent>
              
              <TabsContent value="new" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Would show different games */}
                {games.slice(0, 2).map((game) => (
                  <GameCard key={game.id} {...game} />
                ))}
              </TabsContent>
              
              <TabsContent value="recommended" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Would show different games */}
                {games.slice(2).map((game) => (
                  <GameCard key={game.id} {...game} />
                ))}
              </TabsContent>
            </Tabs>
          </section>
        </main>
      )}
      
      <footer className="bg-card border-t border-border py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                  GameVerse
                </span>
                <span className="text-xl font-bold">Casino</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Play, win, and have fun with friends
              </p>
            </div>
            
            <div className="flex gap-6">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </Link>
              <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground">
                Support
              </Link>
            </div>
          </div>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} GameVerse Casino. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
