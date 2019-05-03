import Faction from '../Faction.js';
import Piece from '../Piece.js';
import Rejection from '../Rejection.js';

class NoMorePieces extends Rejection {
  constructor(threadId, piece) {
    super(threadId, {
      key: 'rejection-no-more-pieces',
      values: { piece: piece.key }
    })
  }
}

export default class Marquise {
  get faction() { return Faction.marquise; }
  constructor() {
    this[Piece[Faction.marquise].sawmill.name] = 6;
    this[Piece[Faction.marquise].workshop.name] = 6;
    this[Piece[Faction.marquise].recruiter.name] = 6;
    this[Piece[Faction.marquise].warrior.name] = 25;
    this[Piece[Faction.marquise].wood.name] = 8;
    this[Piece[Faction.marquise].keep.name] = 1;
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.dominance = null;
    this.craftedItems = [];
  }

  placeKeep(game, clearing) {
    --this[Piece[Faction.marquise].keep.name];
    game.board.clearings[clearing].pieces.push(Piece[Faction.marquise].keep);
    for (const clearing of game.board.clearings) {
      if (clearing.acrossCorner !== clearing) {
        --this[Piece[Faction.marquise].warrior.name];
        clearing.pieces.push(Piece[Faction.marquise].warrior);
      }
    }
    game.notify();
  }

  placeBuilding(game, clearing, building, threadId) {
    if (!this[building.name]) {
      throw new NoMorePieces(threadId, building);
    }
    game.clearings[clearing].addBuilding(building, threadId);
    game.notify();
  }
}
