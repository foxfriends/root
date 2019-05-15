import Faction from '../Faction';
import Game from '../Game';
import { Card } from '../Card';
import { Item } from '../Item';

export default class Alliance {
  warrior: number;
  sympathy: number;
  base_fox: boolean;
  base_rabbit: boolean;
  base_mouse: boolean;
  supporters: Card[];
  officers: number;
  hand: Card[];
  victoryPoints: number;
  craftedItems: Item[];
  dominance: Card | null;

  get faction() { return Faction.alliance; }
  constructor() {
    this.base_mouse = true;
    this.base_fox = true;
    this.base_rabbit = true;
    this.sympathy = 10;
    this.supporters = [];
    this.warrior = 10;
    this.officers = 0;
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.craftedItems = [];
    this.dominance = null;
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
