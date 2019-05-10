import { Piece } from '../model/Piece';
import Clearing from '../model/Clearing';
import Board from '../model/Board';

export default function locate (this: Board, piece: Piece): Clearing {
  return this.clearings
    .find(clearing => clearing.pieces.find(p =>
      piece.faction === p.faction && p.name === piece.name
    ));
}
