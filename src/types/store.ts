
export interface AvatarDetails {
  created_at: string;
  image_url: string;
  item_id: string;
  rarity: string;
  updated_at: string;
}

export interface ChatWordDetails {
  created_at: string;
  item_id: string;
  special_effect: string;
  updated_at: string;
  usage_rules: string | null;
}

export interface StoreItem {
  id: string;
  name: string;
  price: number;
  description: string | null;
  item_type: string;
  created_at: string;
  updated_at: string;
  store_id: string;
  avatars: AvatarDetails | null;
  chat_words: ChatWordDetails | null;
  equipped?: boolean;
}
