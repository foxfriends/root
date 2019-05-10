import Faction from '../Faction';
import { Card } from '../Card';
import { Item } from '../Item';

export default class MarquiseBot {
  public warrior: number;
  public orders: Card[];
  public victoryPoints: number;
  public craftedItems: Item[];

  get faction() { return Faction.marquise_bot; }
  constructor() {
    this.warrior = 25;
    this.orders = [];
    // common stuff
    this.victoryPoints = 0;
    this.craftedItems = [];
  }
}
