import Rejection from '../Rejection.js';

class NoMoreSlots extends Rejection {
  constructor(threadId) {
    super(threadId, {
      key: 'rejection-no-more-slots',
    });
  }
}

export default class Clearing {
  constructor(x, y, suit, slots = [], isCorner = false, acrossCorner = null) {
    this.x = x;
    this.y = y;
    this.suit = suit;
    this.slots = slots;
    this.isCorner = isCorner;
    this.acrossCorner = acrossCorner;
    this.buildings = slots.map(() => null);
    this.pieces = [];
  }

  addBuilding(building, threadId) {
    const emptySlot = this.buildings.indexOf(null);
    if (emptySlot === -1) {
      throw new NoMoreSlots(threadId);
    }
    this.buildings[emptySlot] = building;
  }
}
