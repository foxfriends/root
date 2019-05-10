import Faction from '../Faction';
import { Card } from '../Card';
import { Item } from '../Item';

export default class Riverfolk {
  warrior: number;
  funds: {
    payments: string[],
    funds: string[],
    commitments: string[],
    crafted: {
      fox: string[],
      rabbit: string[],
      mouse: string[],
    }
  };
  tradePosts: {
    fox: number,
    rabbit: number,
    mouse: number,
  };
  services: {
    handCard: number,
    riverboats: number,
    mercenaries: number,
  };
  hand: Card[];
  victoryPoints: number;
  dominance: Card | null;
  craftedItems: Item[];

  get faction() { return Faction.riverfolk; }
  constructor() {
    this.warrior = 15;
    this.funds = {
      payments: [],
      funds: [],
      commitments: [],
      crafted: {
        fox: [],
        rabbit: [],
        mouse: [],
      },
    };
    this.tradePosts = {
      fox: 3,
      rabbit: 3,
      mouse: 3,
    };
    this.services = {
      handCard: 1,
      riverboats: 1,
      mercenaries: 1,
    };
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.dominance = null;
    this.craftedItems = [];
  }
}
