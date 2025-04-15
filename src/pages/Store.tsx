
import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Check, ShoppingCart } from "lucide-react";
import { useItemPurchase } from "@/hooks/useItemPurchase";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StoreItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  item_type: string;
  avatars?: {
    image_url: string;
    rarity: string;
  }[];
  chat_words?: {
    special_effect: string;
    usage_rules: string | null;
  }[];
}

const Store = () => {
  const { toast } = useToast();
  const { purchaseItem, isPurchasing } = useItemPurchase();
  
  // Fetch store items with their details
  const { data: storeItems, isLoading: isLoadingItems } = useQuery({
    queryKey: ['store-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_items')
        .select(`
          *,
          avatars (*),
          chat_words (*)
        `);

      if (error) throw error;
      return data as StoreItem[];
    },
  });
  
  // Fetch wallet balance
  const { data: wallet } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });
  
  // Filter store items by type
  const avatarItems = storeItems?.filter(item => item.item_type === 'avatar') || [];
  const chatwordItems = storeItems?.filter(item => item.item_type === 'chatword') || [];
  
  // Fetch user's owned items
  const { data: userItems } = useQuery({
    queryKey: ['user-items'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_items')
        .select('item_id')
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(item => item.item_id);
    },
  });

  const handlePurchase = (itemId: string, price: number) => {
    if (!wallet || wallet.real_balance < price) {
      toast({
        title: "Solde insuffisant",
        description: "Vous n'avez pas assez d'argent pour acheter cet item",
        variant: "destructive",
      });
      return;
    }
    purchaseItem({ itemId });
  };
  
  const isItemOwned = (itemId: string) => {
    return userItems?.includes(itemId) || false;
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
              ${wallet?.real_balance ?? 0}
              <span className="text-foreground/50 text-xs">
                +${wallet?.bonus_balance ?? 0} bonus
              </span>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="avatars">
          <TabsList className="mb-6">
            <TabsTrigger value="avatars">Avatars</TabsTrigger>
            <TabsTrigger value="chatwords">ChatWords</TabsTrigger>
          </TabsList>
          
          <TabsContent value="avatars">
            {isLoadingItems ? (
              <div className="text-center py-12">Chargement des articles...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {avatarItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <Badge variant="outline">
                          {item.avatars?.[0]?.rarity || 'common'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-4 flex flex-col items-center">
                      <Avatar className="h-24 w-24 mb-2">
                        <AvatarImage src={item.avatars?.[0]?.image_url} />
                        <AvatarFallback>{item.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      
                      <div className="mt-2 text-center">
                        <div className="font-semibold text-lg">${item.price}</div>
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      {isItemOwned(item.id) ? (
                        <Button
                          className="w-full"
                          variant="outline"
                        >
                          <Check className="h-4 w-4 mr-2" /> Possédé
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => handlePurchase(item.id, item.price)}
                          disabled={isPurchasing || !wallet || wallet.real_balance < item.price}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" /> Acheter
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chatwords">
            {isLoadingItems ? (
              <div className="text-center py-12">Chargement des articles...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {chatwordItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {item.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 pb-4">
                      <div className="bg-card p-4 rounded-md border border-border flex items-center justify-center h-16 mb-3">
                        <div className="text-accent font-bold">{item.name}</div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-4">
                        {item.description}
                      </div>
                      
                      <Separator className="mb-4" />
                      
                      <div className="text-center">
                        <div className="font-semibold text-lg">${item.price}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      {isItemOwned(item.id) ? (
                        <Button
                          className="w-full"
                          variant="outline"
                        >
                          <Check className="h-4 w-4 mr-2" /> Possédé
                        </Button>
                      ) : (
                        <Button
                          className="w-full"
                          onClick={() => handlePurchase(item.id, item.price)}
                          disabled={isPurchasing || !wallet || wallet.real_balance < item.price}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" /> Acheter
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
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
