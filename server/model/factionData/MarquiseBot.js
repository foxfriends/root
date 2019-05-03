import Faction from '../Faction.js';

export default class MarquiseBot {
  get faction() { return Faction.marquise_bot; }
  constructor() {
    this.warriors = 25;
    this.orders = [];
    // common stuff
    this.victoryPoints = 0;
    this.craftedItems = [];
  }
}
