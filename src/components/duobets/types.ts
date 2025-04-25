
export type BetFormData = {
  amount: number;
  team_a: string;
  team_b: string;
  match_description: string;
  creator_prediction: 'TeamA' | 'TeamB' | 'Draw';
  expires_at: string;
  is_private?: boolean;  // Add optional is_private field
}
