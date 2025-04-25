
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
  match: any;
}

export function MarketTypeSelect({
  selectedMarket,
  setSelectedMarket,
  markets,
  match
}: MarketTypeSelectProps) {
  // Log odds data for debugging
  console.log("MarketTypeSelect - match odds:", match.odds);
  
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
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sélectionner un type de pari" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {markets?.map((market) => {
              // Display odds if available
              const homeOdds = match.odds?.teama?.value;
              const drawOdds = match.odds?.draw?.value;
              const awayOdds = match.odds?.teamb?.value;
              
              return (
                <SelectItem 
                  key={market.id} 
                  value={market.id.toString()}
                  className="flex items-center justify-between"
                >
                  <span>{market.name}</span>
                  {market.id === 1 && (
                    <span className="text-xs text-muted-foreground">
                      {homeOdds && `1:${homeOdds} `}
                      {drawOdds && `X:${drawOdds} `}
                      {awayOdds && `2:${awayOdds}`}
                    </span>
                  )}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
