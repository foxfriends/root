import { accept } from '../../../model/Acceptor.js';
import Piece from '../../../model/Piece.js';
import Faction from '../../../model/Faction.js';
import Rejection from '../../../model/Rejection.js';

class InvalidClearingForKeep extends Rejection {
  constructor(threadId) {
    super(threadId, {
      key: 'rejection-invalid-clearing-for-keep',
    });
  }
}

class InvalidClearingForStartingBuilding extends Rejection {
  constructor(threadId) {
    super(threadId, {
      key: 'rejection-invalid-clearing-for-starting-building',
    });
  }
}

async function * placeKeep({ clearing }, threadId) {
  if (!this.game.board.clearings[clearing].isCorner) {
    throw new InvalidClearingForKeep(threadId);
  }
  this.game.factionData[Faction.marquise].placeKeep(this.game, clearing);
}

async function * placeSawmill({ clearing }, threadId) {
  const keepClearing = this.game.board.locate(Piece[Faction.marquise].keep);
  const distance = this.game.board.clearingDistance(clearing, keepClearing);
  if (distance > 1) {
    throw new InvalidClearingForStartingBuilding(threadId);
  }
  this.game.factionData[Faction.marquise].placeBuilding(this.game, clearing, Piece[Faction.marquise].sawmill, threadId);
}

async function * placeWorkshop({ clearing }, threadId) {
  const keepClearing = this.game.board.locate(Piece[Faction.marquise].keep);
  const distance = this.game.board.clearingDistance(clearing, keepClearing);
  if (distance > 1) {
    throw new InvalidClearingForStartingBuilding(threadId);
  }
  this.game.factionData[Faction.marquise].placeBuilding(this.game, clearing, Piece[Faction.marquise].workshop, threadId);
}

async function * placeRecruiter({ clearing }, threadId) {
  const keepClearing = this.game.board.locate(Piece[Faction.marquise].keep);
  const distance = this.game.board.clearingDistance(clearing, keepClearing);
  if (distance > 1) {
    throw new InvalidClearingForStartingBuilding(threadId);
  }
  this.game.factionData[Faction.marquise].placeBuilding(this.game, clearing, Piece[Faction.marquise].recruiter, threadId);
}

export default async function * setupMarquise() {
  if (this.game.factionData[Faction.marquise][Piece[Faction.marquise].keep.name]) {
    yield * accept.call(this, placeKeep);
  }
  if (this.game.factionData[Faction.marquise][Piece[Faction.marquise].sawmill.name] === 6) {
    yield * accept.call(this, placeSawmill);
  }
  if (this.game.factionData[Faction.marquise][Piece[Faction.marquise].workshop.name] === 6) {
    yield * accept.call(this, placeWorkshop);
  }
  if (this.game.factionData[Faction.marquise][Piece[Faction.marquise].recruiter.name] === 6) {
    yield * accept.call(this, placeRecruiter);
  }
}
