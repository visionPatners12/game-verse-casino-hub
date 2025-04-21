
export const gameCodeToType = {
  ludo: "Ludo",
  checkers: "Checkers",
  checkgame: "CheckGame",
  futarena: "FUT - ArenaPlay Football"
} as const;

export type GameCode = keyof typeof gameCodeToType;
export type GameVariant = typeof gameCodeToType[GameCode];

// Type guard function - improved to handle case variations
export const isValidGameType = (type: string | undefined): type is GameCode => {
  if (!type) return false;
  // Convert to lowercase for case-insensitive matching
  const normalizedType = type.toLowerCase();
  // Check if it's a valid game code
  return Object.keys(gameCodeToType).includes(normalizedType);
};

export const getGameCodeFromType = (gameTypeValue: string): GameCode | null => {
  const normalizedType = gameTypeValue.toLowerCase();
  for (const [code, name] of Object.entries(gameCodeToType)) {
    if (name.toLowerCase() === normalizedType || code === normalizedType) {
      return code as GameCode;
    }
  }
  return null;
};
