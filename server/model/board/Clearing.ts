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

  static ruler(game: Game, faction: Faction, clearing: Clearing) {
    const hasGarden = clearing.buildings.some(building => !!building && (
      Piece.equals(building, Pieces.cult.garden_fox)
      || Piece.equals(building, Pieces.cult.garden_mouse)
      || Piece.equals(building, Pieces.cult.garden_rabbit)
    ));
    if (hasGarden) {
      // gardens are instantly winning
      return Faction.cult;
    }

    const scores: { [key in Faction]: number } = {
      marquise: 0,
      eyrie: 0,
      alliance: 0,
      riverfolk: 0,
      cult: 0,
      vagabond: 0,
      vagabond2: 0,
      marquise_bot: 0,
    };
    clearing
      .pieces
      .filter(piece => piece.name === 'warrior')
      .map(piece => piece.faction)
      .filter((faction): faction is Faction => faction !== null)
      .filter(faction => faction !== Faction.vagabond && faction !== Faction.vagabond2)
      .map(f => (game.services.mercenaries && f === Faction.riverfolk) ? faction : f)
      .forEach(faction => scores[faction]++);
    clearing
      .buildings
      .map(piece => piece && piece.faction)
      .filter((faction): faction is Faction => faction !== null)
      .forEach(faction => scores[faction]++);
    const best = <[Faction, number]> Object.entries(scores)
      .reduce((best, score) => score[1] > best[1] ? score : best);
    if (best[1] === scores.eyrie && scores.eyrie > 0) {
      return Faction.eyrie;
    } else {
      return best[0];
    }
  }

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
