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
    this.craftedItems = [];
  }

  placeKeep(game: Game, clearing: number) {
    --this.keep;
    game.board.clearings[clearing].addPiece(Pieces.marquise.keep);
    for (const clearing of game.board.clearings) {
      if (clearing.acrossCorner !== clearing.index) {
        --this.warrior;
        clearing.addPiece(Pieces.marquise.warrior);
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
}
