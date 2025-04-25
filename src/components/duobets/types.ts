
export interface CreateDuoBetDialogProps {
  defaultTeams?: {
    teamA: string;
    teamB: string;
    description: string;
  };
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export type BetFormData = {
  amount: number;
  team_a: string;
  team_b: string;
  match_description: string;
  creator_prediction: 'TeamA' | 'TeamB' | 'Draw';
  expires_at: string;
}
