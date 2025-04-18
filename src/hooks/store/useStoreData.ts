
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StoreItem } from "@/types/store";

export const useStoreData = () => {
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

  return {
    storeItems,
    isLoadingItems,
    wallet,
    userData,
    userItems
  };
};
