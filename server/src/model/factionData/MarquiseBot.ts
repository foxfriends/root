import Faction from "../Faction.js";
import { Card } from "../Card.js";
import { Item } from "../Item.js";

export default class MarquiseBot {
  public warrior: number;
  public orders: Card[];
  public victoryPoints: number;
  public craftedItems: Item[];

  get faction() {
    return Faction.marquise_bot;
  }
  constructor() {
    this.warrior = 25;
    this.orders = [];
    // common stuff
    this.victoryPoints = 0;
    this.craftedItems = [];
  }
}
