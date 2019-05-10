import Faction from '../Faction';
import { Item } from '../Item'
import { Card } from '../Card'

export default class Vagabond {
  character: string | null;
  items: {
    refreshed: Item[],
    exhausted: Item[],
    damaged: Item[],
  };
  relations: {
    marquise: number | null,
    eyrie: number | null,
    alliance: number | null,
    cult: number | null,
    riverfolk: number | null,
  };
  coalition: string | null;
  ruinItems: Item[];
  hand: Card[];
  victoryPoints: number;

  constructor(public faction: Faction.vagabond | Faction.vagabond2) {
    this.character = null;
    this.items = {
      refreshed: [],
      exhausted: [],
      damaged: [],
    };
    this.relations = {
      marquise: 1,
      eyrie: 1,
      alliance: 1,
      cult: 1,
      riverfolk: 1,
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
