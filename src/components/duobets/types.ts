
export type DuoBetResult = 'TeamA' | 'TeamB' | 'Draw';

export interface MarketType {
  id: number;
  name: string;
  description: string | null;
  created_at?: string;
}
