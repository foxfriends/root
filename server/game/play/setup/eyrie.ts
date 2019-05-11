import { accept } from '../../../model/Acceptor';
import Piece from '../../../model/Piece';
import Leader from '../../../model/Leader';
import Client from '../../../model/Client';

async function * placeEyrieWarriors(this: Client, clearingIndex: number, threadId: string): AsyncIterableIterator<void> {
  this.game.factionData.eyrie!.placeWarriors(this.game, clearingIndex, 6, threadId);
  this.game.factionData.eyrie!.buildRoost(this.game, clearingIndex, threadId);
  this.respond(threadId, 'update', this.game);
}

async function * eyrieClearing(this: Client, { clearing }: { clearing: number }, threadId: string) {
  yield * placeEyrieWarriors.call(this, clearing, threadId);
}

async function * chooseLeader(this: Client, { leader }: { leader: Leader }, threadId: string) {
  if (!Leader[leader]) {
    throw new Error(`There is no leader called ${leader}`);
  }
  this.game.factionData.eyrie!.setLeader(this.game, leader, threadId);
  const keepClearing = this.game.board.locate(Piece.marquise.keep);
  if (keepClearing) {
    yield * placeEyrieWarriors.call(this, keepClearing.acrossCorner!, threadId);
  } else {
    yield * accept.call(this, eyrieClearing);
  }
}

export default async function * setupEyrie(this: Client) {
  yield * accept.call(this, chooseLeader);
}
