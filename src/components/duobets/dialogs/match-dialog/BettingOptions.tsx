
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
  match: any;
  getMarketOptions: (marketId: number) => MarketOption[];
  possibleGains: number;
}

export function BettingOptions({
  selectedAmount,
  setSelectedAmount,
  selectedMarket,
  setSelectedMarket,
  markets,
  match,
  getMarketOptions,
  possibleGains,
}: BettingOptionsProps) {
  const marketOptions = selectedMarket.id ? getMarketOptions(selectedMarket.id) : [];
  
  // Get odds for selected prediction
  const getOddsValue = (prediction: DuoBetResult): string | null => {
    if (!match.odds) return null;
    
    switch (prediction) {
      case 'TeamA':
        return match.odds.teama?.value || null;
      case 'TeamB':
        return match.odds.teamb?.value || null;
      case 'Draw':
        return match.odds.draw?.value || null;
      default:
        return null;
    }
  };

  const selectedOddsValue = getOddsValue(selectedMarket.value);
  
  const calculatedGains = selectedOddsValue 
    ? Math.round(selectedAmount * parseFloat(selectedOddsValue) * 100) / 100 
    : possibleGains;

  return (
    <div className="space-y-4">
      <MarketTypeSelect
        selectedMarket={selectedMarket}
        setSelectedMarket={setSelectedMarket}
        markets={markets}
        match={match}
      />

      <PredictionSelect
        selectedMarket={selectedMarket}
        setSelectedMarket={setSelectedMarket}
        marketOptions={marketOptions}
      />

      <BetAmountSelector
        selectedAmount={selectedAmount}
        setSelectedAmount={setSelectedAmount}
        possibleGains={calculatedGains}
      />
    </div>
  );
}
