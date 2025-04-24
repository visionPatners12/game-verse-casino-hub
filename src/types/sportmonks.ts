
export interface SportMonksScore {
  id: number;
  fixture_id: number;
  type_id: number;
  participant_id: number;
  score: {
    goals: number;
    participant: "home" | "away";
  };
  description: string;
}

export interface SportMonksParticipant {
  id: number;
  name: string;
  image_path: string;
  meta: {
    location: "home" | "away";
    winner: boolean;
    position: number;
  };
}

export interface SportMonksStage {
  id: number;
  name: string;
  image_path?: string;
}

export interface SportMonksRound {
  id: number;
  name: string;
}

export interface SportMonksMatch {
  id: number;
  name: string;
  starting_at: string;
  scores: SportMonksScore[];
  participants: SportMonksParticipant[];
  stage: SportMonksStage;
  round: SportMonksRound;
}

export interface SportMonksLeague {
  id: number;
  name: string;
  image_path: string;
  today: SportMonksMatch[];
}
