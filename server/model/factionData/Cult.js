import Suit from '../Suit.js';
import Faction from '../Faction.js';

export default class Cult {
  get faction() { return Faction.cult; }
  constructor() {
    this.warriors = 25;
    this.gardens = {
      [Suit.fox]: 5,
      [Suit.rabbit]: 5,
      [Suit.mouse]: 5,
    };
    this.outcast = null;
    this.acolytes = 0;
    this.lostSouls = [];
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.dominance = null;
    this.craftedItems = [];
  }
}
