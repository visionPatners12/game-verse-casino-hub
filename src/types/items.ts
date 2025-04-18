
export interface UserItem {
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
