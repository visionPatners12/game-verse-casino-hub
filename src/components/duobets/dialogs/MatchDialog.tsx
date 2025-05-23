
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { generateBetCode } from "@/lib/utils";
import { toast } from "sonner";
import { useDuoBets } from "@/hooks/useDuoBets";
import { DuoBetResult } from "../types";
import { MARKET_DISPLAYS, MarketOption } from "../types";
import { MatchInfo } from "./match-dialog/MatchInfo";
import { BettingOptions } from "./match-dialog/BettingOptions";
import { BettingActions } from "./match-dialog/BettingActions";

interface MatchDialogProps {
  match: any;
  leagueName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MatchDialog({ match, leagueName, open, onOpenChange }: MatchDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [selectedMarket, setSelectedMarket] = useState<{ 
    id: number; 
    value: DuoBetResult 
  }>({ 
    id: 1, 
    value: "TeamA" 
  });
  
  const { createBet, markets } = useDuoBets();
  const homeTeam = match.participants.find((t: any) => t.meta.location === "home");
  const awayTeam = match.participants.find((t: any) => t.meta.location === "away");
  
  // Log odds data for debugging
  console.log("Match odds data:", match.odds);
  
  const getMarketOptions = (marketId: number): MarketOption[] => {
    const display = MARKET_DISPLAYS[marketId];
    if (!display) return [];
    return display.getOptions(homeTeam.name, awayTeam.name, match.odds);
  };

  // Determine the selected odds based on prediction
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
  console.log("Selected odds value:", selectedOddsValue);

  const possibleGains = selectedOddsValue 
    ? Math.round(selectedAmount * parseFloat(selectedOddsValue) * 100) / 100 
    : selectedAmount * 1.8;

  const handleCreateBet = async (isPrivate: boolean) => {
    try {
      const betCode = generateBetCode();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48);
      
      await createBet.mutateAsync({
        amount: selectedAmount,
        creator_prediction: selectedMarket.value,
        team_a: homeTeam.name,
        team_b: awayTeam.name,
        match_description: `${leagueName} - ${match.stage?.name || match.round?.name || ""}`,
        expires_at: expiresAt.toISOString(),
        bet_code: betCode,
        is_private: isPrivate,
        match_id: match.id,
        market_id: selectedMarket.id,
        market_value: selectedMarket.value
      });
      
      toast.success(
        `Pari ${isPrivate ? "privé" : "public"} créé ! Code: ${betCode}`, 
        { duration: 5000 }
      );
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating bet:", error);
      toast.error("Erreur lors de la création du pari");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl">Détails du Match</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <MatchInfo match={match} leagueName={leagueName} />
          
          <BettingOptions
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            selectedMarket={selectedMarket}
            setSelectedMarket={setSelectedMarket}
            markets={markets}
            match={match} 
            getMarketOptions={getMarketOptions}
            possibleGains={possibleGains}
          />

          <BettingActions
            onCreateBet={handleCreateBet}
            selectedMarket={selectedMarket}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
