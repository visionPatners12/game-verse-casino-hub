
export type GameCode = "ludo" | "checkers" | "tictactoe" | "checkgame" | "futarena";

export enum GameType {
  Ludo = "Ludo",
  Checkers = "Checkers",
  TicTacToe = "TicTacToe",
  CheckGame = "CheckGame",
  EAFC25 = "EA FC25"
}

export const gameCodeToType: { [key in GameCode]: GameType } = {
  ludo: GameType.Ludo,
  checkers: GameType.Checkers,
  tictactoe: GameType.TicTacToe,
  checkgame: GameType.CheckGame,
  futarena: GameType.EAFC25
};

export const isValidGameType = (type: string | undefined): type is GameCode => {
  return type !== undefined && ["ludo", "checkers", "tictactoe", "checkgame", "futarena"].includes(type);
};
