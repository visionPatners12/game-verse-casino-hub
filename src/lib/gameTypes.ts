
export type GameCode = "ludo" | "checkers" | "tictactoe" | "checkgame" | "eafc25" | "madden24" | "nba2k24" | "nhl24";

export enum GameType {
  Ludo = "Ludo",
  Checkers = "Checkers",
  TicTacToe = "TicTacToe",
  CheckGame = "CheckGame",
  EAFC25 = "EAFC25",
  Madden24 = "Madden24",
  NBA2K24 = "NBA2K24",
  NHL24 = "NHL24"
}

export const gameCodeToType: { [key in GameCode]: GameType } = {
  ludo: GameType.Ludo,
  checkers: GameType.Checkers,
  tictactoe: GameType.TicTacToe,
  checkgame: GameType.CheckGame,
  eafc25: GameType.EAFC25,
  madden24: GameType.Madden24,
  nba2k24: GameType.NBA2K24,
  nhl24: GameType.NHL24
};

export const isValidGameType = (type: string | undefined): type is GameCode => {
  return type !== undefined && ["ludo", "checkers", "tictactoe", "checkgame", "eafc25", "madden24", "nba2k24", "nhl24"].includes(type);
};
