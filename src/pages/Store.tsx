import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useItemPurchase } from "@/hooks/useItemPurchase";
import { useEquipItem } from "@/hooks/useEquipItem";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AvatarItem } from "@/components/store/AvatarItem";
import { ChatWordItem } from "@/components/store/ChatWordItem";
import { StoreItem } from "@/types/store";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Store = () => {
  const { toast } = useToast();
  const { purchaseItem, isPurchasing } = useItemPurchase();
  const { equipAvatar, isEquipping } = useEquipItem();
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const pendingPurchaseRef = useRef<string | null>(null);
  
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
  
  const { data: userData } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch the user's equipped avatar ID
      const { data, error } = await supabase
        .from('users')
        .select('equipped_avatar_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return { equipped_avatar_id: null };
      }
      
      return data;
    },
  });
  
  const avatarItems = storeItems?.filter(item => item.item_type === 'avatar') || [];
  const chatwordItems = storeItems?.filter(item => item.item_type === 'chatword') || [];
  
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
    if (pendingPurchaseRef.current === itemId) {
      console.log('Purchase already pending for item:', itemId);
      return; // Skip if already processing this item
    }
    
    setPurchaseError(null);
    
    if (!wallet) {
      setPurchaseError("Impossible d'accéder à votre portefeuille");
      return;
    }
    
    if (wallet.real_balance < price) {
      setPurchaseError(`Solde insuffisant pour cet achat. Vous avez $${wallet.real_balance.toFixed(2)}, l'article coûte $${price.toFixed(2)}`);
      return;
    }
    
    pendingPurchaseRef.current = itemId;
    console.log('Setting pending purchase for item:', itemId);
    
    purchaseItem({ itemId }, {
      onSettled: () => {
        setTimeout(() => {
          console.log('Clearing pending purchase for item:', itemId);
          pendingPurchaseRef.current = null;
        }, 1000);
      }
    });
  };
  
  const isItemOwned = (itemId: string) => {
    return userItems?.includes(itemId) || false;
  };

  const canAffordItem = (price: number) => {
    return wallet && wallet.real_balance >= price;
  };
  
  const isItemEquipped = (itemId: string) => {
    return userData?.equipped_avatar_id === itemId;
  };
  
  const handleEquipAvatar = (itemId: string, imageUrl: string) => {
    equipAvatar({ itemId, imageUrl });
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
        
        {purchaseError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur d'achat</AlertTitle>
            <AlertDescription>
              {purchaseError}
              {wallet && wallet.real_balance < 10 && (
                <div className="mt-2">
                  <Link to="/wallet?tab=deposit" className="underline">
                    Recharger votre portefeuille
                  </Link>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
        
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
                  <AvatarItem
                    key={item.id}
                    item={item}
                    isOwned={isItemOwned(item.id)}
                    onPurchase={handlePurchase}
                    isPurchasing={isPurchasing}
                    canAfford={canAffordItem(item.price)}
                    onEquip={isItemOwned(item.id) ? handleEquipAvatar : undefined}
                    isEquipped={isItemEquipped(item.id)}
                    isEquipping={isEquipping}
                  />
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
                  <ChatWordItem
                    key={item.id}
                    item={item}
                    isOwned={isItemOwned(item.id)}
                    onPurchase={handlePurchase}
                    isPurchasing={isPurchasing}
                    canAfford={canAffordItem(item.price)}
                  />
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
