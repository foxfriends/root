import Leaders from '../Leader.js';
import Faction from '../Faction.js';

export default class Eyrie {
  get faction() { return Faction.eyrie; }
  constructor() {
    this.decree = {
      recruit: [],
      move: [],
      battle: [],
      build: [],
    };
    this.roosts = 7;
    this.warriors = 20;
    this.leader = null;
    this.leaders = Object.values(Leaders);
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.dominance = null;
    this.craftedItems = [];
  }
}
