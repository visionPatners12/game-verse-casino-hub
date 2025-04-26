
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Gamepad } from "lucide-react";
import { Button } from "@/components/ui/button";
import ArenaPlayList from "@/components/arenaplay/ArenaPlayList";
import { GameCode } from "@/lib/gameTypes";

const ArenaPlay = () => {
  const navigate = useNavigate();
  
  const games = [
    {
      id: "fut-arenaplay",
      name: "EA FC25",
      description: "2-4 players",
      type: "futarena" as GameCode,
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2940&auto=format&fit=crop",
      players: { min: 2, max: 4 }
    },
    {
      id: "madden",
      name: "Madden NFL",
      description: "2-4 players",
      type: "madden" as GameCode,
      image: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2926&auto=format&fit=crop",
      players: { min: 2, max: 4 }
    },
    {
      id: "nba2k",
      name: "NBA 2K",
      description: "2-4 players",
      type: "nba2k" as GameCode,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2940&auto=format&fit=crop",
      players: { min: 2, max: 4 }
    },
    {
      id: "college-football",
      name: "College Football",
      description: "2-4 players",
      type: "college" as GameCode,
      image: "https://images.unsplash.com/photo-1541534401786-2077eed87a74?q=80&w=2940&auto=format&fit=crop",
      players: { min: 2, max: 4 }
    },
    {
      id: "mlb",
      name: "MLB The Show",
      description: "2-4 players",
      type: "mlb" as GameCode,
      image: "https://images.unsplash.com/photo-1471295253337-3ceaaedca402?q=80&w=2940&auto=format&fit=crop",
      players: { min: 2, max: 4 }
    },
    {
      id: "cod",
      name: "Call of Duty",
      description: "4-12 players",
      type: "cod" as GameCode,
      image: "https://images.unsplash.com/photo-1576240416624-b2e0026d5a1d?q=80&w=2759&auto=format&fit=crop",
      players: { min: 4, max: 12 }
    },
    {
      id: "fortnite",
      name: "Fortnite",
      description: "4-100 players",
      type: "fortnite" as GameCode,
      image: "https://images.unsplash.com/photo-1589241062272-c0a000072dfa?q=80&w=2874&auto=format&fit=crop",
      players: { min: 4, max: 100 }
    }
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">ArenaPlay Games</h1>
        <Button 
          onClick={() => navigate("/games")}
          variant="outline"
          className="gap-2"
        >
          <Gamepad className="h-4 w-4" />
          Classic Games
        </Button>
      </div>
      
      <ArenaPlayList games={games} />
    </Layout>
  );
};

export default ArenaPlay;
