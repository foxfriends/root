import Faction from '../Faction';
import { Character } from '../Character';
import Game from '../Game'
import { Item } from '../Item'
import { Card } from '../Card'
import Rejection from '../Rejection';

class CharacterAlreadyTaken extends Rejection {
  constructor(threadId: string, character: Character) {
    super(threadId, {
      key: 'rejection-character-already-taken',
      params: { character: `vagbond-character-${character.name}` },
    })
  }
}

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

  setCharacter(game: Game, character: Character, threadId: string) {
    const charactersTaken = [
      game.factionData.vagabond && game.factionData.vagabond.character,
      game.factionData.vagabond2 && game.factionData.vagabond2.character,
    ];
    if (this.character) {
      throw new Error(`${this.faction} already has a character set`);
    }
    if (charactersTaken.includes(character.name)) {
      throw new CharacterAlreadyTaken(threadId, character);
    }
    this.character = character.name;
    this.items.refreshed.push(...character.startingItems);
    game.notify();
  }
}
