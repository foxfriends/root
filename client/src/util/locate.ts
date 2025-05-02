import { Piece } from "server/model/Piece.js";
import Clearing from "server/model/board/Clearing.js";
import Board from "server/model/board/Board.js";

export default function locate(
  this: Board,
  piece: Piece,
): Clearing | undefined {
  return this.clearings.find(
    (clearing) =>
      clearing.pieces.some(
        (p) => piece.faction === p.faction && p.name === piece.name,
      ) ||
      clearing.buildings.some(
        (p) => !!p && piece.faction === p.faction && p.name === piece.name,
      ),
  );
}
