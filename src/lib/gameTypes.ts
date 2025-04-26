
export type GameCode = "ludo" | "checkers" | "tictactoe" | "checkgame" | "futarena" | "eafc25";

export enum GameType {
  Ludo = "Ludo",
  Checkers = "Checkers",
  TicTacToe = "TicTacToe",
  CheckGame = "CheckGame",
  FUTArena = "FUTArena"
}

export const gameCodeToType: { [key in GameCode]: GameType } = {
  ludo: GameType.Ludo,
  checkers: GameType.Checkers,
  tictactoe: GameType.TicTacToe,
  checkgame: GameType.CheckGame,
  futarena: GameType.FUTArena,
  eafc25: GameType.FUTArena
};

export const isValidGameType = (type: string | undefined): type is GameCode => {
  return type !== undefined && ["ludo", "checkers", "tictactoe", "checkgame", "futarena", "eafc25"].includes(type);
};
