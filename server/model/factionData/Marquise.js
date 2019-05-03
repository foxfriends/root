import Faction from '../Faction.js';
export default class Marquise {
  get faction() { return Faction.marquise; }
  constructor() {
    this.buildings = {
      sawmill: 6,
      workshop: 6,
      recruiter: 6,
    };
    this.warriors = 25;
    this.wood = 8;
    this.keep = 1;
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.dominance = null;
    this.craftedItems = [];
  }
}
