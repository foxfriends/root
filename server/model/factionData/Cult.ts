import Faction from '../Faction';
import { Card } from '../Card';
import { Item } from '../Item';

export default class Cult {
  warrior: number;
  gardens: {
    fox: number,
    rabbit: number,
    mouse: number,
  };
  outcast: string | null;
  hated: boolean;
  acolytes: number;
  lostSouls: Card[];
  hand: Card[];
  victoryPoints: number;
  dominance: Card | null;
  craftedItems: Item[];

  get faction() { return Faction.cult; }
  constructor() {
    this.warrior = 25;
    this.gardens = {
      fox: 5,
      rabbit: 5,
      mouse: 5,
    };
    this.outcast = null;
    this.hated = false;
    this.acolytes = 0;
    this.lostSouls = [];
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.dominance = null;
    this.craftedItems = [];
  }
}
