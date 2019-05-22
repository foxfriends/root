import Client from '../../../model/Client';
import Faction from '../../../model/Faction';
import Rejection from '../../../model/Rejection';
import Time from '../../../model/Time';
import Clearing from '../../../model/board/Clearing';
import Pieces, { Piece } from '../../../model/Piece';
import { accept } from '../../../model/Acceptor';
import { birdsong, daylight, evening } from './common';

class NoSawmill extends Rejection {
  constructor(threadId: string) {
    super(threadId, {
      key: 'rejection-no-sawmill',
    });
  }
}

export default async function * marquiseTurn(this: Client) {
  switch (this.game.time) {
    case Time.birdsong:
      yield * birdsong.call(this, Faction.marquise);
      const sawmillClearings = (<Clearing[]> []).concat(...this.game.board
        .clearings
        .filter(clearing => clearing.hasBuilding(Pieces.marquise.sawmill))
        .map(clearing => clearing
          .buildings
          .filter(building => building && Piece.equals(building, Pieces.marquise.sawmill))
          .map(() => clearing)
        )
      );
      if (this.game.factionData.marquise!.wood < sawmillClearings.length) {
        while (this.game.factionData.marquise!.wood) {
          yield * accept.call(this,
            { type: 'sawmill', async * handler (this: Client, { clearing: index }: { clearing: number }, threadId: string): AsyncIterableIterator<void> {
              const clearing = sawmillClearings.find(clearing => clearing.index === index);
              if (!clearing) {
                throw new NoSawmill(threadId);
              }
              this.game.factionData.marquise!.placeWood(this.game, clearing.index, threadId);
              sawmillClearings.splice(sawmillClearings.indexOf(clearing), 1);
              this.respond(threadId, 'update', this.game);
            } },
          );
        }
      } else {
        // put one at each if possible
        for (const clearing of sawmillClearings) {
          this.game.factionData.marquise!.placeWood(this.game, clearing.index, null);
        }
      }
      this.game.nextTime(Time.daylight);
      this.send('update', this.game);
      break;
  }
}
