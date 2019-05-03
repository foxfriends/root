import Faction from './Faction.js';

class Piece {
  constructor(faction, name) {
    this.faction = faction;
    this.name = name;
  }

  get key() {
    return `${this.faction}-${this.name}`;
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
}

export default Pieces;
