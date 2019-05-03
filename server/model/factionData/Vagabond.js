import Faction from '../Faction.js';
import { Item } from '../Item.js'

export default class Vagabond {
  constructor(faction) {
    this.faction = faction;
    this.character = null;
    this.items = {
      refreshed: [],
      exhausted: [],
      damaged: [],
    };
    this.relations = {
      [Faction.marquise]: 1,
      [Faction.eyrie]: 1,
      [Faction.alliance]: 1,
      [Faction.cult]: 1,
      [Faction.riverfolk]: 1,
    };
    this.coalition = null;
    this.ruinItems = [
      new Item(Item.hammer, true),
      new Item(Item.boot, true),
      new Item(Item.sword, true),
      new Item(Item.bag, true),
    ];
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
  }
}
