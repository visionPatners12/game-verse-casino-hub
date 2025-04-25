
import React from "react";
import { Button } from "@/components/ui/button";
import { MarketOption } from "../../types";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { DuoBetResult } from "../../types";

interface BettingOptionsProps {
  selectedAmount: number;
  setSelectedAmount: (amount: number) => void;
  selectedMarket: { id: number; value: DuoBetResult };
  setSelectedMarket: (market: { id: number; value: DuoBetResult }) => void;
  markets: any[];
  getMarketOptions: (marketId: number) => MarketOption[];
  possibleGains: number;
}

export function BettingOptions({
  selectedAmount,
  setSelectedAmount,
  selectedMarket,
  setSelectedMarket,
  markets,
  getMarketOptions,
  possibleGains,
}: BettingOptionsProps) {
  return (
    <div className="space-y-4">
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

      {selectedMarket.id && (
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
                {getMarketOptions(selectedMarket.id).map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex items-center justify-between">
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
      </div>

      <div className="text-sm">
        <span className="font-medium">Gains potentiels: </span>
        <span className="text-green-600 font-bold">{possibleGains}€</span>
      </div>
    </div>
  );
}
