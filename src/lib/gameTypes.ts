export const gameCodeToType = {
  ludo: "Ludo",
  checkers: "Checkers",
  checkgame: "CheckGame"
} as const;

export type GameCode = keyof typeof gameCodeToType;
export type GameVariant = typeof gameCodeToType[GameCode];

// Type guard function
export const isValidGameType = (type: string | undefined): type is GameCode => {
  return !!type && Object.keys(gameCodeToType).includes(type);
};
