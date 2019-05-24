import { accept } from '../../../model/Acceptor';
import subset from '../../../util/subset';
import Rejection from '../../../model/Rejection';
import Client from '../../../model/Client';
import Faction from '../../../model/Faction';
import Suit from '../../../model/Suit';
import { Card } from '../../../model/Card';
import cardEffect from './cardEffect';

export async function * birdsong (this: Client, faction: Faction): AsyncIterableIterator<void> {
  // TODO: check victory conditions
  if (this.game.factions.includes(Faction.riverfolk) && faction !== Faction.riverfolk) {
    // TODO: purchase services
  }
  // TODO: activate crafted effects
  this.game.nextPhase();
}

export async function * daylight (this: Client, faction: Faction): AsyncIterableIterator<void> {
  // TODO: activate crafted effects
  this.game.nextPhase();
}

export async function * evening (this: Client, faction: Faction): AsyncIterableIterator<void> {
  // TODO: activate crafted effects
  this.game.nextPhase();
}

class CannotAffordCrafting extends Rejection {
  constructor(threadId: string, card: Card) {
    super(threadId, {
      key: 'rejection-cannot-afford-crafting',
      params: {
        card: `card-${card.name}`,
      },
    });
  }
}

const CANCEL = Symbol();
export async function * craft (this: Client, resources: Suit[], faction_: Faction): AsyncIterableIterator<void> {
  if (faction_ === Faction.marquise_bot) { return; }
  const faction = faction_;

  async function * craftCard (this: Client, { card: index }: { card: number }, threadId: string) {
    const card = this.game.factionData[faction]!.hand[index];
    if (!card || !card.cost || !subset(card.cost, resources)) {
      throw new CannotAffordCrafting(threadId, card);
    }
    yield * cardEffect.call(this, card, faction, threadId);
    for (const suit of card.cost) {
      resources.splice(resources.indexOf(suit), 1);
    }
  }

  async function * cancel (this: Client) {
    return CANCEL;
  }

  while (CANCEL !== (yield * accept.call(this, craftCard, cancel))) {

  }
}
