import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package2, Check, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEquipItem } from "@/hooks/useEquipItem";
import { AvatarItem } from "@/components/store/AvatarItem";
import { ChatWordItem } from "@/components/store/ChatWordItem";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StoreItem } from "@/types/store";

interface UserItem {
  id: string;
  purchased_at: string;
  item: {
    id: string;
    name: string;
    description: string | null;
    item_type: string;
    price: number;
    avatars: {
      image_url: string;
      rarity: string;
    } | null;
    chat_words?: {
      special_effect: string;
    } | null;
  };
  equipped: boolean;
}

const MyItems = () => {
  const { toast } = useToast();
  const { equipAvatar, isEquipping } = useEquipItem();

  const { data: userItems, isLoading } = useQuery({
    queryKey: ['user-items'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Fetch the user's equipped avatar ID
      const { data: userData } = await supabase
        .from('users')
        .select('equipped_avatar_id')
        .eq('id', user.id)
        .single();

      const equippedAvatarId = userData?.equipped_avatar_id;

      const { data, error } = await supabase
        .from('user_items')
        .select(`
          id,
          purchased_at,
          item_id,
          item:store_items(
            id,
            name,
            description,
            item_type,
            price,
            avatars (
              image_url,
              rarity
            ),
            chat_words (
              special_effect
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const formattedItems = data.map(item => ({
        ...item,
        equipped: item.item_id === equippedAvatarId,
        item: {
          ...item.item,
          id: item.item_id,
          avatars: item.item.avatars?.[0] || null
        }
      })) as UserItem[];
      
      return formattedItems;
    },
  });

  const handleEquipAvatar = (itemId: string, imageUrl: string) => {
    equipAvatar({ itemId, imageUrl });
  };

  const avatarItems = userItems?.filter(item => item.item.item_type === 'avatar') || [];
  const chatWordItems = userItems?.filter(item => item.item.item_type === 'chatword') || [];

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Mes Items</h1>
      
      {isLoading ? (
        <div className="text-center py-8">Chargement de vos items...</div>
      ) : !userItems?.length ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Package2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Vous n'avez pas encore d'items</h2>
            <p className="text-muted-foreground">Visitez notre boutique pour acheter des items exclusifs!</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="avatars">
          <TabsList className="mb-6">
            <TabsTrigger value="avatars">Avatars</TabsTrigger>
            <TabsTrigger value="chatwords">ChatWords</TabsTrigger>
          </TabsList>
          
          <TabsContent value="avatars">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {avatarItems.map((item) => {
                const avatarItem: StoreItem = {
                  id: item.item.id,
                  name: item.item.name,
                  price: item.item.price,
                  description: item.item.description,
                  item_type: item.item.item_type,
                  created_at: "",
                  updated_at: "",
                  store_id: "",
                  avatars: item.item.avatars ? {
                    image_url: item.item.avatars.image_url,
                    rarity: item.item.avatars.rarity,
                    created_at: "",
                    updated_at: "",
                    item_id: item.item.id
                  } : null,
                  chat_words: null
                };

                return (
                  <AvatarItem
                    key={item.id}
                    item={avatarItem}
                    isOwned={true}
                    onPurchase={() => {}}
                    isPurchasing={false}
                    canAfford={true}
                    onEquip={handleEquipAvatar}
                    isEquipped={item.equipped}
                    isEquipping={isEquipping}
                  />
                );
              })}
            </div>
            {avatarItems.length === 0 && (
              <div className="text-center py-12">
                <p>Vous n'avez pas encore d'avatars. Visitez la boutique pour en acheter.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="chatwords">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {chatWordItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">{item.item.name}</CardTitle>
                    <Badge>ChatWord</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{item.item.description}</p>
                    {item.item.chat_words?.special_effect && (
                      <p className="text-sm">
                        <span className="font-medium">Effet spécial:</span> {item.item.chat_words.special_effect}
                      </p>
                    )}
                    <div className="mt-4 text-xs text-muted-foreground">
                      Acheté le: {format(new Date(item.purchased_at), 'dd/MM/yyyy')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {chatWordItems.length === 0 && (
              <div className="text-center py-12">
                <p>Vous n'avez pas encore de ChatWords. Visitez la boutique pour en acheter.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </Layout>
  );
};

export default MyItems;
