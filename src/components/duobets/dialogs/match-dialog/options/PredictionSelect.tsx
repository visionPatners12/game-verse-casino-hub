
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DuoBetResult, MarketOption } from "@/components/duobets/types";

interface PredictionSelectProps {
  selectedMarket: { id: number; value: DuoBetResult };
  setSelectedMarket: (market: { id: number; value: DuoBetResult }) => void;
  marketOptions: MarketOption[];
}

export function PredictionSelect({
  selectedMarket,
  setSelectedMarket,
  marketOptions,
}: PredictionSelectProps) {
  if (!selectedMarket.id) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Votre Prédiction</label>
      <Select
        value={selectedMarket.value}
        onValueChange={(value) => setSelectedMarket({ 
          ...selectedMarket, 
          value: value as DuoBetResult 
        })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner votre prédiction" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {marketOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
