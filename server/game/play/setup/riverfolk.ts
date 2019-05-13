import { accept } from '../../../model/Acceptor';
import Client from '../../../model/Client';
import Rejection from '../../../model/Rejection';
import { ServiceCosts } from '../../../model/factionData/Riverfolk';

class NotARiver extends Rejection {
  constructor(threadId: string) {
    super(threadId, {
      key: 'rejection-not-a-river',
    });
  }
}

async function * placeWarrior(this: Client, { clearing }: { clearing: number }, threadId: string): AsyncIterableIterator<void> {
  if (!(<number[]> []).concat(...this.game.board.rivers).includes(clearing)) {
    throw new NotARiver(threadId);
  }
  this.game.factionData.riverfolk!.placeWarriors(this.game, clearing, 1, threadId);
  this.respond(threadId, 'update', this.game);
}

async function * setPrices(this: Client, { handCard, riverboats, mercenaries }: ServiceCosts, threadId: string): AsyncIterableIterator<void> {
  if (handCard < 1 || riverboats < 1 || mercenaries < 1 || handCard > 4 || riverboats > 4 || mercenaries > 4) {
    throw new Error('Invalid service cost');
  }
  this.game.factionData.riverfolk!.setPrices(this.game, { handCard, riverboats, mercenaries });
  this.respond(threadId, 'update', this.game);
}

export default async function * setupRiverfolk(this: Client) {
  while (this.game.factionData.riverfolk!.warrior > 11) {
    yield * accept.call(this, placeWarrior);
  }
  yield * accept.call(this, setPrices);
}
