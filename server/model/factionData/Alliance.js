import Suit from '../Suit.js';
import Faction from '../Faction.js';

export default class Alliance {
  get faction() { return Faction.alliance; }
  constructor() {
    this.bases = {
      [Suit.fox]: true,
      [Suit.rabbit]: true,
      [Suit.mouse]: true,
    };
    this.sympathy = 10;
    this.supporters = [];
    this.warriors = 10;
    this.officers = 0;
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.craftedItems = [];
    this.dominance = null;
  }
}
