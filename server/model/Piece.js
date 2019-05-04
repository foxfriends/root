import Faction from './Faction.js';

class Piece {
  constructor(faction, name) {
    this.faction = faction;
    this.name = name;
  }

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
}

const Pieces = {
  [Faction.marquise]: {
    keep: new Piece(Faction.marquise, 'keep'),
    wood: new Piece(Faction.marquise, 'wood'),
    warrior: new Piece(Faction.marquise, 'warrior'),
    sawmill: new Piece(Faction.marquise, 'sawmill'),
    workshop: new Piece(Faction.marquise, 'workshop'),
    recruiter: new Piece(Faction.marquise, 'recruiter'),
  },
  ruin: new Piece(null, 'ruin'),
}

export default Pieces;
