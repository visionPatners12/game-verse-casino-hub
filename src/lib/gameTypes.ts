export type GameCode = "ludo" | "checkers" | "tictactoe" | "checkgame" | "futarena" | "eafc25" | "madden24" | "nba2k24" | "nhl24";

export enum GameType {
  Ludo = "Ludo",
  Checkers = "Checkers",
  TicTacToe = "TicTacToe",
  CheckGame = "CheckGame",
  FUTArena = "FUTArena",
  Madden24 = "Madden24",
  NBA2K24 = "NBA2K24",
  NHL24 = "NHL24"
}

export const gameCodeToType: { [key in GameCode]: GameType } = {
  ludo: GameType.Ludo,
  checkers: GameType.Checkers,
  tictactoe: GameType.TicTacToe,
  checkgame: GameType.CheckGame,
  futarena: GameType.FUTArena,
  eafc25: GameType.FUTArena,
  madden24: GameType.Madden24,
  nba2k24: GameType.NBA2K24,
  nhl24: GameType.NHL24
};

export const isValidGameType = (type: string | undefined): type is GameCode => {
  return type !== undefined && ["ludo", "checkers", "tictactoe", "checkgame", "futarena", "eafc25", "madden24", "nba2k24", "nhl24"].includes(type);
};
