import Faction from './Faction';

export class Piece {
  constructor(
    public faction: string | null,
    public name: string,
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
    keep: new Piece(Faction.marquise, 'keep'),
    wood: new Piece(Faction.marquise, 'wood'),
    warrior: new Piece(Faction.marquise, 'warrior'),
    sawmill: new Piece(Faction.marquise, 'sawmill'),
    workshop: new Piece(Faction.marquise, 'workshop'),
    recruiter: new Piece(Faction.marquise, 'recruiter'),
  },
  eyrie: {
    roost: new Piece(Faction.eyrie, 'roost'),
    warrior: new Piece(Faction.eyrie, 'warrior'),
  },
  alliance: {
    sympathy: new Piece(Faction.alliance, 'sympathy'),
    base_fox: new Piece(Faction.alliance, 'base_fox'),
    base_rabbit: new Piece(Faction.alliance, 'base_rabbit'),
    base_mouse: new Piece(Faction.alliance, 'base_mouse'),
    warrior: new Piece(Faction.alliance, 'warrior'),
  },
  vagabond: {
    warrior: new Piece(Faction.vagabond, 'warrior'),
  },
  vagabond2: {
    warrior: new Piece(Faction.vagabond2, 'warrior'),
  },
  cult: {
    warrior: new Piece(Faction.cult, 'warrior'),
    garden_fox: new Piece(Faction.cult, 'garden_fox'),
    garden_rabbit: new Piece(Faction.cult, 'garden_rabbit'),
    garden_mouse: new Piece(Faction.cult, 'garden_mouse'),
  },
  riverfolk: {
    warrior: new Piece(Faction.riverfolk, 'warrior'),
    trade_post_fox: new Piece(Faction.riverfolk, 'trade_post_fox'),
    trade_post_rabbit: new Piece(Faction.riverfolk, 'trade_post_rabbit'),
    trade_post_mouse: new Piece(Faction.riverfolk, 'trade_post_mouse'),
  },
  marquise_bot: {
    warrior: new Piece(Faction.marquise_bot, 'warrior'),
  },
  ruin: new Piece(null, 'ruin'),
}

export default Pieces;
