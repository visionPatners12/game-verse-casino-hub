
import { StoreItem } from "@/types/store";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, MessageSquare, ShoppingCart } from "lucide-react";

interface ChatWordItemProps {
  item: StoreItem;
  isOwned: boolean;
  onPurchase: (itemId: string, price: number) => void;
  isPurchasing: boolean;
  canAfford: boolean;
}

export const ChatWordItem = ({ item, isOwned, onPurchase, isPurchasing, canAfford }: ChatWordItemProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {item.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="bg-card p-4 rounded-md border border-border flex items-center justify-center h-16 mb-3">
          <div className="text-accent font-bold">{item.name}</div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-4">
          {item.description}
        </div>
        
        <Separator className="mb-4" />
        
        <div className="text-center">
          <div className="font-semibold text-lg">${item.price}</div>
          {item.chat_words?.special_effect && (
            <p className="text-xs text-muted-foreground mt-1">
              Effet spécial: {item.chat_words.special_effect}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isOwned ? (
          <Button
            className="w-full"
            variant="outline"
          >
            <Check className="h-4 w-4 mr-2" /> Possédé
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => onPurchase(item.id, item.price)}
            disabled={isPurchasing || !canAfford}
          >
            <ShoppingCart className="h-4 w-4 mr-2" /> Acheter
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
