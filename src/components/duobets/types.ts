
export type DuoBetResult = 'TeamA' | 'TeamB' | 'Draw' | 'Yes' | 'No';

export interface Market {
  id: number;
  name: string;
  odds?: {
    home?: { value: string; probability: string };
    away?: { value: string; probability: string };
    draw?: { value: string; probability: string };
  };
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
  getOptions: (teamA: string, teamB: string, odds?: any) => MarketOption[];
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
    getOptions: (teamA: string, teamB: string, odds) => [
      { value: 'TeamA', label: `${teamA} ${odds?.teama ? `@${odds.teama.value}` : ''}` },
      { value: 'Draw', label: `Match nul ${odds?.draw ? `@${odds.draw.value}` : ''}` },
      { value: 'TeamB', label: `${teamB} ${odds?.teamb ? `@${odds.teamb.value}` : ''}` }
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
