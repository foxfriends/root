import Rejection from '../Rejection.js';
import Piece from '../Piece.js';

class NoRuins extends Error {
  constructor() {
    super('There is no ruin in this clearing');
  }
}

class NoMoreSlots extends Rejection {
  constructor(threadId) {
    super(threadId, {
      key: 'rejection-no-more-slots',
    });
  }
}

export default class Clearing {
  constructor(index, x, y, suit, slots = [], isCorner = false, acrossCorner = null) {
    this.index = index;
    this.x = x;
    this.y = y;
    this.suit = suit;
    this.slots = slots;
    this.isCorner = isCorner;
    this.acrossCorner = acrossCorner;
    this.buildings = slots.map(slot => slot.isRuin ? Piece.ruin : null);
    this.pieces = [];
    this.ruinItems = [];
  }

  addBuilding(building, threadId) {
    const emptySlot = this.buildings.indexOf(null);
    if (emptySlot === -1) {
      throw new NoMoreSlots(threadId);
    }
    this.buildings[emptySlot] = building;
  }

  addRuinItem(item) {
    if (!this.buildings.includes(Piece.ruin)) {
      throw new NoRuins();
    }
    this.ruinItems.push(item);
  }
}
