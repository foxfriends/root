export default class Clearing {
  constructor(x, y, suit, slots = [], isCorner = false) {
    this.x = x;
    this.y = y;
    this.suit = suit;
    this.slots = slots;
    this.isCorner = isCorner;

    this.buildings = slots.map(() => null);
    this.pieces = {};
  }
}
