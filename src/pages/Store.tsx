
import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useItemPurchase } from "@/hooks/useItemPurchase";
import { useEquipItem } from "@/hooks/useEquipItem";
import { useStoreData } from "@/hooks/store/useStoreData";
import { StoreHeader } from "@/components/store/StoreHeader";
import { StoreItems } from "@/components/store/StoreItems";

const Store = () => {
  const { toast } = useToast();
  const { purchaseItem, isPurchasing } = useItemPurchase();
  const { equipAvatar, isEquipping } = useEquipItem();
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const pendingPurchaseRef = useRef<string | null>(null);
  
  const { storeItems, isLoadingItems, wallet, userData, userItems } = useStoreData();

  const handlePurchase = (itemId: string, price: number) => {
    if (pendingPurchaseRef.current === itemId) {
      console.log('Purchase already pending for item:', itemId);
      return;
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
        <StoreHeader 
          balance={wallet?.real_balance}
          bonusBalance={wallet?.bonus_balance}
          purchaseError={purchaseError}
        />
        
        <StoreItems
          isLoading={isLoadingItems}
          items={storeItems || []}
          isItemOwned={isItemOwned}
          onPurchase={handlePurchase}
          isPurchasing={isPurchasing}
          canAffordItem={canAffordItem}
          onEquipAvatar={handleEquipAvatar}
          isItemEquipped={isItemEquipped}
          isEquipping={isEquipping}
        />
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
