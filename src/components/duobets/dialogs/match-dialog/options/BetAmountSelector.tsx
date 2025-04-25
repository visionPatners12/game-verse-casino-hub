
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BetAmountSelectorProps {
  selectedAmount: number;
  setSelectedAmount: (amount: number) => void;
  possibleGains: number;
}

export function BetAmountSelector({
  selectedAmount,
  setSelectedAmount,
  possibleGains,
}: BetAmountSelectorProps) {
  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setSelectedAmount(value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <span className="text-sm font-medium">Montant du pari:</span>
        <div className="flex items-center gap-2">
          {[5, 10, 20, 50].map((amount) => (
            <Button
              key={amount}
              variant={selectedAmount === amount ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedAmount(amount)}
            >
              {amount}€
            </Button>
          ))}
        </div>
        <Input
          type="number"
          value={selectedAmount}
          onChange={handleCustomAmount}
          min={1}
          className="mt-2"
          placeholder="Montant personnalisé"
        />
      </div>

      <div className="text-sm">
        <span className="font-medium">Gains potentiels: </span>
        <span className="text-green-600 font-bold">{possibleGains}€</span>
      </div>
    </div>
  );
}
