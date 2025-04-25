
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Users, PlusCircle, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Game {
  id: string;
  name: string;
  description: string;
  type: string;
  image: string;
  players: {
    min: number;
    max: number;
  };
}

interface ArenaPlayListProps {
  games: Game[];
}

const ArenaPlayList = ({ games }: ArenaPlayListProps) => {
  const navigate = useNavigate();

  const handlePublicRoomClick = (gameType: string) => {
    navigate(`/games/${gameType}/public`);
  };

  const handleCreateGameClick = (gameType: string) => {
    navigate(`/games/${gameType}/create`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {games.map((game) => (
        <Card key={game.id} className="group overflow-hidden">
          <div className="relative aspect-video overflow-hidden">
            <Button 
              size="icon" 
              variant="outline" 
              className="absolute top-3 right-3 z-10 bg-background/50 hover:bg-background/80"
              onClick={() => handlePublicRoomClick(game.type)}
            >
              <Globe className="h-4 w-4" />
            </Button>

            <img 
              src={game.image} 
              alt={game.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 bg-background/80 backdrop-blur-sm"
              >
                <Users className="h-3 w-3" />
                {game.players.min === game.players.max
                  ? game.players.min
                  : `${game.players.min}-${game.players.max}`}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">{game.name}</h3>
            <p className="text-sm text-muted-foreground">{game.description}</p>
          </CardContent>
          
          <CardFooter className="p-6 pt-0 gap-2">
            <Button 
              onClick={() => handlePublicRoomClick(game.type)} 
              className="w-full"
            >
              Public Room
            </Button>
            <Button 
              onClick={() => handleCreateGameClick(game.type)}
              variant="outline"
              className="w-full gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Create Room
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ArenaPlayList;
