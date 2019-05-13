import Faction from './Faction';

export class Piece {
  constructor(
    public faction: string | null,
    public name: string,
    public shape: 'round' | 'square' | 'other',
  ) {}

  get key() {
    if (this.faction) {
      return `${this.faction}-${this.name}`;
    } else {
      return this.name;
    }
  }

  toJSON() {
    return { ...this, key: this.key };
  }

  static equals(piece: Piece, other: Piece) {
    return piece.key === other.key;
  }
}

const Pieces = {
  marquise: {
    keep: new Piece(Faction.marquise, 'keep', 'round'),
    wood: new Piece(Faction.marquise, 'wood', 'round'),
    warrior: new Piece(Faction.marquise, 'warrior', 'other'),
    sawmill: new Piece(Faction.marquise, 'sawmill', 'square'),
    workshop: new Piece(Faction.marquise, 'workshop', 'square'),
    recruiter: new Piece(Faction.marquise, 'recruiter', 'square'),
  },
  eyrie: {
    roost: new Piece(Faction.eyrie, 'roost', 'square'),
    warrior: new Piece(Faction.eyrie, 'warrior', 'other'),
  },
  alliance: {
    sympathy: new Piece(Faction.alliance, 'sympathy', 'round'),
    base_fox: new Piece(Faction.alliance, 'base_fox', 'square'),
    base_rabbit: new Piece(Faction.alliance, 'base_rabbit', 'square'),
    base_mouse: new Piece(Faction.alliance, 'base_mouse', 'square'),
    warrior: new Piece(Faction.alliance, 'warrior', 'other'),
  },
  vagabond: {
    warrior: new Piece(Faction.vagabond, 'warrior', 'other'),
  },
  vagabond2: {
    warrior: new Piece(Faction.vagabond2, 'warrior', 'other'),
  },
  cult: {
    warrior: new Piece(Faction.cult, 'warrior', 'other'),
    garden_fox: new Piece(Faction.cult, 'garden_fox', 'square'),
    garden_rabbit: new Piece(Faction.cult, 'garden_rabbit', 'square'),
    garden_mouse: new Piece(Faction.cult, 'garden_mouse', 'square'),
  },
  riverfolk: {
    warrior: new Piece(Faction.riverfolk, 'warrior', 'other'),
    trade_post_fox: new Piece(Faction.riverfolk, 'trade_post_fox', 'round'),
    trade_post_rabbit: new Piece(Faction.riverfolk, 'trade_post_rabbit', 'round'),
    trade_post_mouse: new Piece(Faction.riverfolk, 'trade_post_mouse', 'round'),
  },
  marquise_bot: {
    warrior: new Piece(Faction.marquise_bot, 'warrior', 'other'),
  },
  ruin: new Piece(null, 'ruin', 'square'),
}

export default Pieces;
