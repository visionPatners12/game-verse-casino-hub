
import { StoreItem } from "@/types/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarItem } from "./AvatarItem";
import { ChatWordItem } from "./ChatWordItem";

interface StoreItemsProps {
  isLoading: boolean;
  items: StoreItem[];
  isItemOwned: (itemId: string) => boolean;
  onPurchase: (itemId: string, price: number) => void;
  isPurchasing: boolean;
  canAffordItem: (price: number) => boolean;
  onEquipAvatar?: (itemId: string, imageUrl: string) => void;
  isItemEquipped: (itemId: string) => boolean;
  isEquipping: boolean;
}

export const StoreItems = ({
  isLoading,
  items,
  isItemOwned,
  onPurchase,
  isPurchasing,
  canAffordItem,
  onEquipAvatar,
  isItemEquipped,
  isEquipping,
}: StoreItemsProps) => {
  const avatarItems = items?.filter(item => item.item_type === 'avatar') || [];
  const chatwordItems = items?.filter(item => item.item_type === 'chatword') || [];

  return (
    <Tabs defaultValue="avatars">
      <TabsList className="mb-6">
        <TabsTrigger value="avatars">Avatars</TabsTrigger>
        <TabsTrigger value="chatwords">ChatWords</TabsTrigger>
      </TabsList>
      
      <TabsContent value="avatars">
        {isLoading ? (
          <div className="text-center py-12">Chargement des articles...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {avatarItems.map((item) => (
              <AvatarItem
                key={item.id}
                item={item}
                isOwned={isItemOwned(item.id)}
                onPurchase={onPurchase}
                isPurchasing={isPurchasing}
                canAfford={canAffordItem(item.price)}
                onEquip={isItemOwned(item.id) ? onEquipAvatar : undefined}
                isEquipped={isItemEquipped(item.id)}
                isEquipping={isEquipping}
              />
            ))}
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="chatwords">
        {isLoading ? (
          <div className="text-center py-12">Chargement des articles...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {chatwordItems.map((item) => (
              <ChatWordItem
                key={item.id}
                item={item}
                isOwned={isItemOwned(item.id)}
                onPurchase={onPurchase}
                isPurchasing={isPurchasing}
                canAfford={canAffordItem(item.price)}
              />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
