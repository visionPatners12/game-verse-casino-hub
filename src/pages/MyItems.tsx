
import { Layout } from "@/components/Layout";
import { EmptyInventory } from "@/components/items/EmptyInventory";
import { ItemsTabs } from "@/components/items/ItemsTabs";
import { useUserItems } from "@/hooks/items/useUserItems";

const MyItems = () => {
  const { userItems, isLoading } = useUserItems();
  
  if (isLoading) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold mb-8">Mes Items</h1>
        <div className="text-center py-8">Chargement de vos items...</div>
      </Layout>
    );
  }

  if (!userItems?.length) {
    return (
      <Layout>
        <h1 className="text-3xl font-bold mb-8">Mes Items</h1>
        <EmptyInventory />
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8">Mes Items</h1>
      <ItemsTabs userItems={userItems} />
    </Layout>
  );
};

export default MyItems;
