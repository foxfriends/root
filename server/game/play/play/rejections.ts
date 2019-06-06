import Rejection from '../../../model/Rejection';
import Suit from '../../../model/Suit';
import Faction from '../../../model/Faction';

export class InvalidCardSuit extends Rejection {
  constructor(threadId: string, suit: Suit) {
    super(threadId, {
      key: 'rejection-invalid-card-suit',
      params: { suit: `suit-${suit}` },
    });
  }
}

export class NoTargetsForBattle extends Rejection {
  constructor(threadId: string) {
    super(threadId, {
      key: 'rejection-no-targets-for-battle',
    });
  }
}

export class NoPiecesOfFaction extends Rejection {
  constructor(threadId: string, faction: Faction) {
    super(threadId, {
      key: 'rejection-no-pieces-of-faction',
      params: { faction },
    });
  }
}

export class Cancel extends Rejection { }
