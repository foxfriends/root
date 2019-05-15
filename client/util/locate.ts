import { Piece } from '../model/Piece';
import Clearing from '../model/board/Clearing';
import Board from '../model/board/Board';

export default function locate (this: Board, piece: Piece): Clearing | undefined {
  return this.clearings
    .find(clearing => clearing.pieces.some(p => piece.faction === p.faction && p.name === piece.name)
                   || clearing.buildings.some(p => !!p && (piece.faction === p.faction && p.name === piece.name)));
}
