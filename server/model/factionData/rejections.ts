import Rejection from '../Rejection';
import { Piece } from '../Piece';

export class NoMorePieces extends Rejection {
  constructor(threadId: string, piece: Piece) {
    super(threadId, {
      key: 'rejection-no-more-pieces',
      params: { piece: piece.key },
    })
  }
}
