import { Piece } from "../Piece.js";
import Game from "../Game.js";

export default class ForestZone {
  public pieces: Piece[];

  constructor(
    public index: number,
    public x: number,
    public y: number,
    public clearings: number[],
  ) {
    this.pieces = [];
  }

  addPiece(game: Game, piece: Piece) {
    this.pieces.push(piece);
    game.notify();
  }
}
