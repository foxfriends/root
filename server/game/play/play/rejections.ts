import Rejection from '../../../model/Rejection';
import Suit from '../../../model/Suit';

export class InvalidCardSuit extends Rejection {
  constructor(threadId: string, suit: Suit) {
    super(threadId, {
      key: 'rejection-invalid-card-suit',
      params: { suit: `suit-${suit}` },
    });
  }
}
