import { get } from 'svelte/store';
import borrow from '../../util/borrow';
import { game, username, prompts } from '../../store';
import { accept } from '../../model/Acceptor';
import Client from '../../model/Client';
import Pieces, { Piece } from '../../model/Piece';
import Clearing from '../../model/board/Clearing';
import Faction from '../../model/Faction';
import Time from '../../model/Time';

import { birdsong, daylight, evening } from './common';

async function * marquiseBirdsong(this: Client) {
  switch (get(game)!.phase) {
    case 0:
      yield * birdsong.call(this, Faction.marquise);
      break;
    case 1:
      const sawmillClearings = (<Clearing[]> []).concat(...get(game)!.board.clearings
        .filter(clearing => Clearing.hasBuilding(clearing, Pieces.marquise.sawmill))
        .map(clearing => clearing.buildings
          .filter(building => building && Piece.equals(building, Pieces.marquise.sawmill))
          .map(() => clearing)
        )
      );
      while (get(game)!.factionData.marquise!.wood) {
        prompts.set({
          text: 'prompt-choose-sawmill',
          clearings: sawmillClearings,
        });
        game.set(yield * accept.call(this,
          { type: 'Prompts:clearing', async * handler ({ clearing }: { clearing: Clearing }) {
            const game = await this.send('clearing', { clearing: clearing.index });
            sawmillClearings.splice(sawmillClearings.findIndex(c => c.index === clearing.index), 1);
            return game;
          } },
        ));
      }
      prompts.set(null);
      break;
  }
}

async function * marquiseDaylight(this: Client) {
  yield * daylight.call(this, Faction.marquise);
}

async function * marquiseEvening(this: Client) {
  yield * evening.call(this, Faction.marquise);
}

export default async function * marquiseTurn (this: Client) {
  switch (get(game)!.time) {
    case Time.birdsong:
      yield * marquiseBirdsong.call(this);
      break;
    case Time.daylight:
      yield * marquiseDaylight.call(this);
      break;
    case Time.evening:
      yield * marquiseEvening.call(this);
      break;
  }
}
