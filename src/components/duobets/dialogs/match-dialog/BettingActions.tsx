
import React from "react";
import { Button } from "@/components/ui/button";
import { Lock, Globe } from "lucide-react";

interface BettingActionsProps {
  onCreateBet: (isPrivate: boolean) => Promise<void>;
  selectedMarket: { value: string };
}

export function BettingActions({ onCreateBet, selectedMarket }: BettingActionsProps) {
  return (
    <div className="flex justify-between gap-4">
      <Button
        className="flex-1"
        onClick={() => onCreateBet(true)}
        disabled={!selectedMarket.value}
      >
        <Lock className="mr-2" /> Paris Privé
      </Button>
      <Button
        className="flex-1"
        onClick={() => onCreateBet(false)}
        disabled={!selectedMarket.value}
      >
        <Globe className="mr-2" /> Paris Public
      </Button>
    </div>
  );
}
