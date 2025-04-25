
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DuoBetResult } from "@/components/duobets/types";

interface MarketTypeSelectProps {
  selectedMarket: { id: number; value: DuoBetResult };
  setSelectedMarket: (market: { id: number; value: DuoBetResult }) => void;
  markets: any[];
}

export function MarketTypeSelect({
  selectedMarket,
  setSelectedMarket,
  markets,
}: MarketTypeSelectProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Type de Pari</label>
      <Select 
        value={selectedMarket.id.toString()} 
        onValueChange={(value) => setSelectedMarket({ 
          id: parseInt(value), 
          value: "" as DuoBetResult 
        })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un type de pari" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {markets?.map((market) => (
              <SelectItem key={market.id} value={market.id.toString()}>
                {market.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
