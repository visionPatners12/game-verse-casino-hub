
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Check, ShoppingCart } from "lucide-react";

interface AvatarItem {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  isOwned: boolean;
}

interface ChatWordItem {
  id: string;
  text: string;
  effect: string;
  price: number;
  preview: React.ReactNode;
  isOwned: boolean;
}

const Store = () => {
  const { toast } = useToast();
  
  // Mock user data
  const user = {
    name: "Player123",
    balance: {
      real: 500,
      bonus: 100,
    },
  };
  
  // Mock store items - avatars
  const [avatars, setAvatars] = useState<AvatarItem[]>([
    {
      id: "avatar1",
      name: "Golden Crown",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=crown&backgroundColor=f9d71c",
      price: 50,
      category: "premium",
      isOwned: false,
    },
    {
      id: "avatar2",
      name: "Blue Robot",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=robot&backgroundColor=5d96f5",
      price: 30,
      category: "standard",
      isOwned: true,
    },
    {
      id: "avatar3",
      name: "Purple Alien",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=alien&backgroundColor=9b87f5",
      price: 40,
      category: "premium",
      isOwned: false,
    },
    {
      id: "avatar4",
      name: "Green Monster",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=monster&backgroundColor=7adf7a",
      price: 35,
      category: "standard",
      isOwned: false,
    },
    {
      id: "avatar5",
      name: "Red Devil",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=devil&backgroundColor=f57575",
      price: 45,
      category: "premium",
      isOwned: false,
    },
    {
      id: "avatar6",
      name: "Cyan Ghost",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=ghost&backgroundColor=7af5f5",
      price: 30,
      category: "standard",
      isOwned: false,
    },
    {
      id: "avatar7",
      name: "Rainbow Unicorn",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=unicorn&backgroundColor=f5a9f2",
      price: 60,
      category: "premium",
      isOwned: false,
    },
    {
      id: "avatar8",
      name: "Diamond King",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=king&backgroundColor=a9f5f2",
      price: 75,
      category: "exclusive",
      isOwned: false,
    },
  ]);
  
  // Mock chat words
  const [chatWords, setChatWords] = useState<ChatWordItem[]>([
    {
      id: "word1",
      text: "WINNER!",
      effect: "Animated golden text with confetti",
      price: 20,
      preview: (
        <div className="animate-pulse-glow text-accent font-bold">WINNER!</div>
      ),
      isOwned: false,
    },
    {
      id: "word2",
      text: "GOOD LUCK",
      effect: "Sparkling blue text",
      price: 15,
      preview: (
        <div className="text-blue-500 font-semibold">GOOD LUCK</div>
      ),
      isOwned: true,
    },
    {
      id: "word3",
      text: "BOOM!",
      effect: "Exploding red text",
      price: 25,
      preview: (
        <div className="text-red-500 font-bold animate-bounce">BOOM!</div>
      ),
      isOwned: false,
    },
    {
      id: "word4",
      text: "LEGENDARY",
      effect: "Rainbow gradient text",
      price: 30,
      preview: (
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent font-bold">
          LEGENDARY
        </div>
      ),
      isOwned: false,
    },
    {
      id: "word5",
      text: "NICE MOVE",
      effect: "Pulsing green text",
      price: 15,
      preview: (
        <div className="text-green-500 font-semibold">NICE MOVE</div>
      ),
      isOwned: false,
    },
    {
      id: "word6",
      text: "OH NO!",
      effect: "Shaking text effect",
      price: 20,
      preview: (
        <div className="text-orange-500 font-bold">OH NO!</div>
      ),
      isOwned: false,
    },
  ]);
  
  const purchaseItem = (type: "avatar" | "chatword", id: string) => {
    if (type === "avatar") {
      setAvatars(
        avatars.map((avatar) =>
          avatar.id === id ? { ...avatar, isOwned: true } : avatar
        )
      );
    } else {
      setChatWords(
        chatWords.map((word) =>
          word.id === id ? { ...word, isOwned: true } : word
        )
      );
    }
    
    toast({
      title: "Purchase Successful",
      description: "Item has been added to your inventory",
    });
  };
  
  const equipItem = (type: "avatar" | "chatword", id: string) => {
    toast({
      title: "Item Equipped",
      description:
        type === "avatar"
          ? "Avatar has been set as your profile picture"
          : "Chat word is now available to use in games",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Store</h1>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Your Balance</div>
            <div className="font-medium text-accent">
              ${user.balance.real} <span className="text-foreground/50 text-xs">+${user.balance.bonus} bonus</span>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="avatars">
          <TabsList className="mb-6">
            <TabsTrigger value="avatars">Avatars</TabsTrigger>
            <TabsTrigger value="chatwords">ChatWords</TabsTrigger>
          </TabsList>
          
          <TabsContent value="avatars">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {avatars.map((avatar) => (
                <Card key={avatar.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-base">{avatar.name}</CardTitle>
                      <Badge
                        variant={
                          avatar.category === "premium"
                            ? "default"
                            : avatar.category === "exclusive"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {avatar.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 flex flex-col items-center">
                    <Avatar className="h-24 w-24 mb-2">
                      <AvatarImage src={avatar.image} />
                      <AvatarFallback>{avatar.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    
                    <div className="mt-2 text-center">
                      <div className="font-semibold text-lg">${avatar.price}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {avatar.isOwned ? (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => equipItem("avatar", avatar.id)}
                      >
                        <Check className="h-4 w-4 mr-2" /> Equip
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => purchaseItem("avatar", avatar.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" /> Purchase
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="chatwords">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {chatWords.map((word) => (
                <Card key={word.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      {word.text}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <div className="bg-card p-4 rounded-md border border-border flex items-center justify-center h-16 mb-3">
                      {word.preview}
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-4">
                      {word.effect}
                    </div>
                    
                    <Separator className="mb-4" />
                    
                    <div className="text-center">
                      <div className="font-semibold text-lg">${word.price}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {word.isOwned ? (
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => equipItem("chatword", word.id)}
                      >
                        <Check className="h-4 w-4 mr-2" /> Use in Chat
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => purchaseItem("chatword", word.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" /> Purchase
                      </Button>
                    )}
                  </CardFooter>
                </Card>
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

export default Store;
