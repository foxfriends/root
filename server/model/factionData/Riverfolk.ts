import Faction from '../Faction';
import { Card } from '../Card';
import { Item } from '../Item';

export default class Riverfolk {
  warrior: number;
  trade_post_fox: number;
  trade_post_rabbit: number;
  trade_post_mouse: number;
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
    this.trade_post_fox = 3;
    this.trade_post_rabbit = 3;
    this.trade_post_mouse = 3;
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
