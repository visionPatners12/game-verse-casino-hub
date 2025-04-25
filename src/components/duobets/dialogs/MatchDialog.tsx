
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Globe, Lock, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateBetCode } from "@/lib/utils";
import { toast } from "sonner";
import { useDuoBets } from "@/hooks/useDuoBets";
import { supabase } from "@/integrations/supabase/client";

interface MatchDialogProps {
  match: any;
  leagueName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Define the market type interface
interface MarketType {
  id: number;
  name: string;
  description?: string;
}

export function MatchDialog({ match, leagueName, open, onOpenChange }: MatchDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [selectedMarket, setSelectedMarket] = useState({ id: 1, value: "TeamA" });
  const { createBet } = useDuoBets();
  const [markets, setMarkets] = useState<MarketType[]>([]);
  const homeTeam = match.participants.find((t: any) => t.meta.location === "home");
  const awayTeam = match.participants.find((t: any) => t.meta.location === "away");
  
  // Fetch available markets when dialog opens
  useEffect(() => {
    const fetchMarkets = async () => {
      // Using a function to get market types instead of direct table access
      const { data, error } = await supabase
        .rpc('get_available_markets');
      
      if (error) {
        console.error("Error fetching markets:", error);
        return;
      }
      
      setMarkets(data || []);
    };
    
    if (open) {
      fetchMarkets();
    }
  }, [open]);

  const possibleGains = selectedAmount * 1.8; // Example multiplier

  const getMarketOptions = (marketId: number) => {
    switch (marketId) {
      case 1: // 1X2
        return [
          { value: "TeamA", label: homeTeam.name },
          { value: "Draw", label: "Match nul" },
          { value: "TeamB", label: awayTeam.name }
        ];
      case 14: // Both Teams To Score
        return [
          { value: "Yes", label: "Oui" },
          { value: "No", label: "Non" }
        ];
      case 29: // Double Chance
        return [
          { value: "1X", label: `${homeTeam.name} ou Nul` },
          { value: "12", label: `${homeTeam.name} ou ${awayTeam.name}` },
          { value: "X2", label: `Nul ou ${awayTeam.name}` }
        ];
      case 10: // Over/Under
        return [
          { value: "Over2.5", label: "Plus de 2.5 buts" },
          { value: "Under2.5", label: "Moins de 2.5 buts" }
        ];
      default:
        return [];
    }
  };

  const handleCreateBet = async (isPrivate: boolean) => {
    try {
      const betCode = generateBetCode();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 48); // Expires in 48 hours
      
      // For 1X2 markets, map value to TeamA/Draw/TeamB
      let mappedPrediction = selectedMarket.value;
      
      await createBet.mutateAsync({
        amount: selectedAmount,
        creator_prediction: mappedPrediction,
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
          <div>
            <Badge variant="secondary" className="mb-2">
              {leagueName} - {match.stage?.name || match.round?.name || ""}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {format(new Date(match.starting_at), "dd MMMM yyyy - HH:mm", { locale: fr })}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src={homeTeam.image_path} alt={homeTeam.name} className="h-8 w-8" />
              <span className="font-medium">{homeTeam.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={awayTeam.image_path} alt={awayTeam.name} className="h-8 w-8" />
              <span className="font-medium">{awayTeam.name}</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Market Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Type de Pari</label>
              <Select 
                value={selectedMarket.id.toString()} 
                onValueChange={(value) => setSelectedMarket({ id: parseInt(value), value: "" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type de pari" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {markets.map((market) => (
                      <SelectItem key={market.id} value={market.id.toString()}>
                        {market.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Market Option Selection */}
            {selectedMarket.id && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Votre Prédiction</label>
                <Select
                  value={selectedMarket.value}
                  onValueChange={(value) => setSelectedMarket({ ...selectedMarket, value })}
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

          <div className="flex justify-between gap-4">
            <Button
              className="flex-1"
              onClick={() => handleCreateBet(true)}
              disabled={!selectedMarket.value}
            >
              <Lock className="mr-2" /> Paris Privé
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleCreateBet(false)}
              disabled={!selectedMarket.value}
            >
              <Globe className="mr-2" /> Paris Public
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
