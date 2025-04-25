export type DuoBetResult = 'TeamA' | 'TeamB' | 'Draw' | 'Yes' | 'No';

export interface Market {
  id: number;
  name: string;
  odds?: number;
}

export interface MarketType {
  id: number;
  name: string;
  description: string | null;
  created_at?: string;
}

export interface MarketOption {
  value: DuoBetResult;
  label: string;
}

export interface MarketDisplay {
  getLabel: (prediction: DuoBetResult) => string;
  getOptions: (teamA: string, teamB: string) => MarketOption[];
}

export const MARKET_DISPLAYS: Record<number, MarketDisplay> = {
  1: {
    getLabel: (prediction: DuoBetResult) => {
      switch (prediction) {
        case 'TeamA': return '1';
        case 'TeamB': return '2';
        case 'Draw': return 'X';
        default: return prediction;
      }
    },
    getOptions: (teamA: string, teamB: string) => [
      { value: 'TeamA', label: teamA },
      { value: 'Draw', label: 'Match nul' },
      { value: 'TeamB', label: teamB }
    ]
  },
  2: {
    getLabel: (prediction: DuoBetResult) => {
      switch (prediction) {
        case 'Yes': return 'Oui';
        case 'No': return 'Non';
        default: return prediction;
      }
    },
    getOptions: () => [
      { value: 'Yes', label: 'Oui' },
      { value: 'No', label: 'Non' }
    ]
  }
};
