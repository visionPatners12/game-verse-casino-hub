
import { UserItem } from "@/types/items";
import { AvatarItem } from "@/components/store/AvatarItem";
import { StoreItem } from "@/types/store";
import { useEquipItem } from "@/hooks/useEquipItem";

interface AvatarsListProps {
  items: UserItem[];
}

export const AvatarsList = ({ items }: AvatarsListProps) => {
  const { equipAvatar, isEquipping } = useEquipItem();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p>Vous n'avez pas encore d'avatars. Visitez la boutique pour en acheter.</p>
      </div>
    );
  }

  const handleEquipAvatar = (itemId: string, imageUrl: string) => {
    equipAvatar({ itemId, imageUrl });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => {
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
  );
};
