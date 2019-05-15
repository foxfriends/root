import { accept } from '../../../model/Acceptor';
import Client from '../../../model/Client';
import Pieces from '../../../model/Piece';
import Suit from '../../../model/Suit';
import { InvalidStartClearing } from '../../../model/factionData/rejections';

async function * setCultClearing (this: Client, clearingIndex: number, threadId?: string): AsyncIterableIterator<void> {
  const adjacentClearings = this.game.board.adjacentClearings(clearingIndex);
  for (const clearing of adjacentClearings) {
    this.game.factionData.cult!.placeWarriors(this.game, clearing.index, 1, threadId!);
  }
  this.game.factionData.cult!.placeWarriors(this.game, clearingIndex, 4, threadId!);
  this.game.factionData.cult!.buildGarden(this.game, clearingIndex, threadId!);
  if (threadId) {
    this.respond(threadId, 'update', this.game);
  } else {
    this.send('update', this.game);
  }
}

async function * chooseClearing (this: Client, { clearing }: { clearing: number }, threadId: string) {
  if (!this.game.board.clearings[clearing].isCorner) {
    throw new InvalidStartClearing(threadId);
  }
  yield * setCultClearing.call(this, clearing, threadId);
}

async function * chooseOutcast (this: Client, { outcast }: { outcast: Suit }, threadId: string): AsyncIterableIterator<void> {
  if (!Suit[outcast]) {
    throw new Error(`Unknown suit ${outcast}`);
  }
  this.game.factionData.cult!.setOutcast(this.game, outcast);
  this.respond(threadId, 'update', this.game);
}

export default async function * setupCult (this: Client) {
  if (!this.game.board.locate(Pieces.cult.warrior)) {
    const keepClearing = this.game.board.locate(Pieces.marquise.keep);
    const eyrieClearing = this.game.board.locate(Pieces.eyrie.roost);
    if ((keepClearing && eyrieClearing) || (!keepClearing && !eyrieClearing)) {
      yield * accept.call(this, chooseClearing);
    } else {
      yield * setCultClearing.call(this, (keepClearing || eyrieClearing)!.acrossCorner!);
    }
  }
  yield * accept.call(this, chooseOutcast);
}
