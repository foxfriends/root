import Faction from '../Faction';
import Game from '../Game';
import { Card } from '../Card';
import { Item } from '../Item';

export default class Alliance {
  warrior: number;
  sympathy: number;
  base_fox: number;
  base_rabbit: number;
  base_mouse: number;
  supporters: Card[];
  officers: number;
  hand: Card[];
  victoryPoints: number;
  craftedItems: Item[];
  craftedEffects: Card[];
  dominance: Card | null;

  get faction() { return Faction.alliance; }
  constructor() {
    this.base_mouse = 1;
    this.base_fox = 1;
    this.base_rabbit = 1;
    this.sympathy = 10;
    this.supporters = [];
    this.warrior = 10;
    this.officers = 0;
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.craftedItems = [];
    this.craftedEffects = [];
    this.dominance = null;
  }

  addItem(item: Item) {
    this.craftedItems.push(item);
  }

  drawSupporter(game: Game, count: number = 1) {
    const cards = game.takeCards(count);
    this.supporters.push(...cards);
    game.notify();
  }

  addSupporter(card: Card) {
    this.supporters.push(card);
  }
}
