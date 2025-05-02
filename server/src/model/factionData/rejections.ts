import Rejection from "../Rejection.js";
import { Piece } from "../Piece.js";

export class InvalidStartClearing extends Rejection {
  constructor(threadId: string) {
    super(threadId, {
      key: "rejection-invalid-start-clearing",
    });
  }
}

export class NoMorePieces extends Rejection {
  constructor(threadId: string, piece: Piece) {
    super(threadId, {
      key: "rejection-no-more-pieces",
      params: { piece: piece.key },
    });
  }
}
