
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarsList } from "./AvatarsList";
import { ChatWordsList } from "./ChatWordsList";
import { UserItem } from "@/types/items";

interface ItemsTabsProps {
  userItems: UserItem[];
}

export const ItemsTabs = ({ userItems }: ItemsTabsProps) => {
  const avatarItems = userItems.filter(item => item.item.item_type === 'avatar');
  const chatWordItems = userItems.filter(item => item.item.item_type === 'chatword');

  return (
    <Tabs defaultValue="avatars">
      <TabsList className="mb-6">
        <TabsTrigger value="avatars">Avatars</TabsTrigger>
        <TabsTrigger value="chatwords">ChatWords</TabsTrigger>
      </TabsList>
      
      <TabsContent value="avatars">
        <AvatarsList items={avatarItems} />
      </TabsContent>
      
      <TabsContent value="chatwords">
        <ChatWordsList items={chatWordItems} />
      </TabsContent>
    </Tabs>
  );
};
