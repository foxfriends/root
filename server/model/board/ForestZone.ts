import { Piece } from '../Piece';
import Game from '../Game';

export default class ForestZone {
  public pieces: Piece[];

  constructor(
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
