import Rejection from '../Rejection';
import Pieces, { Piece } from '../Piece';
import Slot from './Slot';
import Suit from '../Suit';
import Game from '../Game';
import Faction from '../Faction';
import { Item } from '../Item';

class NoRuins extends Error {
  constructor() {
    super('There is no ruin in this clearing');
  }
}

class NoMoreSlots extends Rejection {
  constructor(threadId: string) {
    super(threadId, {
      key: 'rejection-no-more-slots',
    });
  }
}

export default class Clearing {
  public buildings: (Piece | null)[];
  public pieces: Piece[];
  public ruinItems: Item[];

  static hasBuilding(clearing: Clearing, piece: Piece) {
    return clearing.buildings.some(p => !!p && Piece.equals(piece, p));
  }

  constructor(
    public index: number,
    public x: number,
    public y: number,
    public suit: Suit,
    public slots: Slot[] = [],
    public isCorner = false,
    public acrossCorner: number | null = null,
  ) {
    this.buildings = slots.map(slot => slot.isRuin ? Pieces.ruin : null);
    this.pieces = [];
    this.ruinItems = [];
  }

  addPiece(piece: Piece) {
    this.pieces.push(piece);
  }

  removePiece(index: number) {
    const [piece] = this.pieces.splice(index, 1);
    return piece;
  }

  addBuilding(building: Piece, threadId: string) {
    const emptySlot = this.buildings.indexOf(null);
    if (emptySlot === -1) {
      throw new NoMoreSlots(threadId);
    }
    this.buildings[emptySlot] = building;
  }

  hasBuilding(piece: Piece) {
    return Clearing.hasBuilding(this, piece);
  }

  get hasRuins() {
    return this.hasBuilding(Pieces.ruin);
  }

  addRuinItem(item: Item) {
    if (!this.buildings.includes(Pieces.ruin)) {
      throw new NoRuins;
    }
    this.ruinItems.push(item);
  }

  toJSON() {
    return {
      ...this,
      hasRuins: this.hasRuins,
      ruinItems: this.ruinItems.length,
    };
  }
}
