import Faction from '../Faction';
import Pieces, { Piece } from '../Piece';
import Game from '../Game';
import { Card } from '../Card';
import { Item } from '../Item';
import { NoMorePieces } from './rejections';

export default class Marquise {
  sawmill: number;
  workshop: number;
  recruiter: number;
  warrior: number;
  wood: number;
  keep: number;

  hand: Card[];
  victoryPoints: number;
  dominance: Card | null;
  craftedEffects: Card[];
  craftedItems: Item[];

  get faction() { return Faction.marquise; }
  constructor() {
    this.sawmill = 6;
    this.workshop = 6;
    this.recruiter = 6;
    this.warrior = 25;
    this.wood = 8;
    this.keep = 1;
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.dominance = null;
    this.craftedEffects = [];
    this.craftedItems = [];
  }

  placeKeep(game: Game, clearing: number) {
    --this.keep;
    game.board.clearings[clearing].addPiece(Pieces.marquise.keep);
    for (const otherClearing of game.board.clearings) {
      if (otherClearing.acrossCorner !== clearing) {
        --this.warrior;
        otherClearing.addPiece(Pieces.marquise.warrior);
      }
    }
    game.notify();
  }

  placeBuilding(game: Game, clearing: number, building: Piece, threadId: string) {
    if (!this[<keyof Marquise> building.name]) {
      throw new NoMorePieces(threadId, building);
    }
    game.board.clearings[clearing].addBuilding(building, threadId);
    --(<number> this[<keyof Marquise> building.name]);
    game.notify();
  }

  placeWood(game: Game, clearing: number, threadId: string | null) {
    if (!this.wood) {
      if (threadId) {
        throw new NoMorePieces(threadId, Pieces.marquise.wood);
      } else {
        return;
      }
    }
    game.board.clearings[clearing].addPiece(Pieces.marquise.wood);
    --this.wood;
    game.notify();
  }
}
