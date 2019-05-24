import Client from '../../../model/Client';
import Faction from '../../../model/Faction';
import Rejection from '../../../model/Rejection';
import Time from '../../../model/Time';
import Suit from '../../../model/Suit';
import Clearing from '../../../model/board/Clearing';
import Pieces, { Piece } from '../../../model/Piece';
import { InvalidCardSuit } from './rejections';
import { accept } from '../../../model/Acceptor';
import { birdsong, daylight, evening, craft } from './common';

class NoSawmill extends Rejection {
  constructor(threadId: string) {
    super(threadId, {
      key: 'rejection-no-sawmill',
    });
  }
}

function sawmill (sawmillClearings: Clearing[]) {
  return async function * sawmill (this: Client, { clearing: index }: { clearing: number }, threadId: string): AsyncIterableIterator<void> {
    const clearing = sawmillClearings.find(clearing => clearing.index === index);
    if (!clearing) {
      throw new NoSawmill(threadId);
    }
    this.game.factionData.marquise!.placeWood(this.game, clearing.index, threadId);
    sawmillClearings.splice(sawmillClearings.indexOf(clearing), 1);
    this.respond(threadId, 'update', this.game);
  }
}

const EXTRA_ACTION = Symbol();

async function * extraAction (this: Client, { card: index }: { card: number }, threadId: string): AsyncIterableIterator<void> {
  const card = this.game.factionData.marquise!.hand[index];
  if (!card || card.suit !== Suit.bird) {
    throw new InvalidCardSuit(threadId, Suit.bird);
  }
  this.game.discard(card);
  this.game.factionData.marquise!.hand.splice(index, 1);
  this.respond(threadId, 'update', this.game);
  return EXTRA_ACTION;
}

async function * marquiseBirdsong(this: Client) {
  switch (this.game.phase) {
  // @ts-ignore: falls through
  case 0:
    yield * birdsong.call(this, Faction.marquise);
    /* falls through */
  case 1:
    const sawmillClearings = (<Clearing[]> []).concat(...this.game.board
      .clearings
      .filter(clearing => clearing.hasBuilding(Pieces.marquise.sawmill))
      .map(clearing => clearing
        .buildings
        .filter(building => building && Piece.equals(building, Pieces.marquise.sawmill))
        .map(() => clearing)
      )
    );
    if (this.game.factionData.marquise!.wood < sawmillClearings.length) {
      while (this.game.factionData.marquise!.wood) {
        yield * accept.call(this, sawmill(sawmillClearings));
      }
    } else {
      // put one at each if possible
      for (const clearing of sawmillClearings) {
        this.game.factionData.marquise!.placeWood(this.game, clearing.index, null);
      }
    }
    this.game.nextTime(Time.daylight);
    this.send('update', this.game);
  }
}

async function * marquiseDaylight (this: Client) {
  switch (this.game.phase) {
  // @ts-ignore: falls through
  case 0:
    yield * daylight.call(this, Faction.marquise);
  // @ts-ignore: falls through
  case 1:
    yield * craft.call(this, Faction.marquise);
    // TODO: crafting
    /* falls through */
  case 2:
  default:
    let allowedActions = this.game.phase + 3;
    while (this.game.phase < allowedActions) {
      // TODO: actions
      this.game.nextPhase();
      if (this.game.phase === allowedActions && this.game.factionData.marquise!.hand.some(card => card.suit === Suit.bird)) {
        if (EXTRA_ACTION === (yield * accept.call(this, extraAction, 'done'))) {
          ++allowedActions;
        }
      }
    }
  }
}

async function * marquiseEvening (this: Client) {
  yield * evening.call(this, Faction.marquise);
}

export default async function * marquiseTurn(this: Client) {
  switch (this.game.time) {
  // @ts-ignore: falls through
  case Time.birdsong:
    yield * marquiseBirdsong.call(this);
  // @ts-ignore: falls through
  case Time.daylight:
    yield * marquiseDaylight.call(this);
    /* falls through */
  case Time.evening:
    yield * marquiseEvening.call(this);
  }
}
