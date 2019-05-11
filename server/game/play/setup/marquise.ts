import { accept } from '../../../model/Acceptor';
import Client from '../../../model/Client';
import Piece from '../../../model/Piece';
import Rejection from '../../../model/Rejection';

class InvalidClearingForKeep extends Rejection {
  constructor(threadId: string) {
    super(threadId, {
      key: 'rejection-invalid-clearing-for-keep',
    });
  }
}

class InvalidClearingForStartingBuilding extends Rejection {
  constructor(threadId: string) {
    super(threadId, {
      key: 'rejection-invalid-clearing-for-starting-building',
    });
  }
}

async function * placeKeep(this: Client, { clearing }: { clearing: number }, threadId: string): AsyncIterableIterator<void> {
  if (!this.game.board.clearings[clearing].isCorner) {
    throw new InvalidClearingForKeep(threadId);
  }
  this.game.factionData.marquise!.placeKeep(this.game, clearing);
  this.respond(threadId, 'update', this.game);
}

async function * placeSawmill(this: Client, { clearing }: { clearing: number }, threadId: string): AsyncIterableIterator<void> {
  const keepClearing = this.game.board.locate(Piece.marquise.keep)!;
  const distance = this.game.board.clearingDistance(clearing, keepClearing.index);
  if (distance > 1) {
    throw new InvalidClearingForStartingBuilding(threadId);
  }
  this.game.factionData.marquise!.placeBuilding(this.game, clearing, Piece.marquise.sawmill, threadId);
  this.respond(threadId, 'update', this.game);
}

async function * placeWorkshop(this: Client, { clearing }: { clearing: number }, threadId: string): AsyncIterableIterator<void> {
  const keepClearing = this.game.board.locate(Piece.marquise.keep)!;
  const distance = this.game.board.clearingDistance(clearing, keepClearing.index);
  if (distance > 1) {
    throw new InvalidClearingForStartingBuilding(threadId);
  }
  this.game.factionData.marquise!.placeBuilding(this.game, clearing, Piece.marquise.workshop, threadId);
  this.respond(threadId, 'update', this.game);
}

async function * placeRecruiter(this: Client, { clearing }: { clearing: number }, threadId: string): AsyncIterableIterator<void> {
  const keepClearing = this.game.board.locate(Piece.marquise.keep)!;
  const distance = this.game.board.clearingDistance(clearing, keepClearing.index);
  if (distance > 1) {
    throw new InvalidClearingForStartingBuilding(threadId);
  }
  this.game.factionData.marquise!.placeBuilding(this.game, clearing, Piece.marquise.recruiter, threadId);
  this.respond(threadId, 'update', this.game);
}

export default async function * setupMarquise(this: Client) {
  if (this.game.factionData.marquise!.keep) {
    yield * accept.call(this, placeKeep);
  }
  if (this.game.factionData.marquise!.sawmill === 6) {
    yield * accept.call(this, placeSawmill);
  }
  if (this.game.factionData.marquise!.workshop === 6) {
    yield * accept.call(this, placeWorkshop);
  }
  if (this.game.factionData.marquise!.recruiter === 6) {
    yield * accept.call(this, placeRecruiter);
  }
}
