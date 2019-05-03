import Faction from '../Faction.js';
import Suit from '../Suit.js';

export default class Riverfolk {
  get faction() { return Faction.riverfolk; }
  constructor() {
    this.warriors = 15;
    this.funds = {
      payments: [],
      funds: [],
      commitments: [],
      crafted: {
        [Suit.fox]: [],
        [Suit.rabbit]: [],
        [Suit.mouse]: [],
      },
    };
    this.tradePosts = {
      [Suit.fox]: 3,
      [Suit.rabbit]: 3,
      [Suit.mouse]: 3,
    };
    this.services = {
      handCard: null,
      riverboats: null,
      mercenaries: null,
    };
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.dominance = null;
    this.craftedItems = [];
  }
}
