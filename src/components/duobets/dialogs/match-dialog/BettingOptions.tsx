
import React from "react";
import { DuoBetResult, MarketOption } from "../../types";
import { MarketTypeSelect } from "./options/MarketTypeSelect";
import { PredictionSelect } from "./options/PredictionSelect";
import { BetAmountSelector } from "./options/BetAmountSelector";

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
  const marketOptions = selectedMarket.id ? getMarketOptions(selectedMarket.id) : [];

  return (
    <div className="space-y-4">
      <MarketTypeSelect
        selectedMarket={selectedMarket}
        setSelectedMarket={setSelectedMarket}
        markets={markets}
      />

      <PredictionSelect
        selectedMarket={selectedMarket}
        setSelectedMarket={setSelectedMarket}
        marketOptions={marketOptions}
      />

      <BetAmountSelector
        selectedAmount={selectedAmount}
        setSelectedAmount={setSelectedAmount}
        possibleGains={possibleGains}
      />
    </div>
  );
}
