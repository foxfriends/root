import { get } from 'svelte/store';
import borrow from '../../util/borrow';
import { game, prompts } from '../../store';
import { accept } from '../../model/Acceptor';
import locate from '../../util/locate';
import Faction from '../../model/Faction';
import Piece from '../../model/Piece';

export default async function * setupMarquise() {
  let keepClearing = locate.call(get(game).board, Piece[Faction.marquise].keep);
  if (!keepClearing) {
    prompts.set({
      clearings: get(game).board.clearings
        .filter(clearing => clearing.isCorner)
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }) {
        keepClearing = clearing;
        return this.send('placeKeep', { clearing: clearing.index });
      }},
    ));
  }

  const sawmillClearing = locate.call(get(game).board, Piece[Faction.marquise].sawmill);
  if (!sawmillClearing) {
    prompts.set({
      clearings: borrow(game)(game => {
        return game.board.clearings
          .filter(clearing =>
            // can select the keep clearing
            clearing.index === keepClearing.index
            // or the connected clearings
            || game.board.paths.some(path => path.includes(clearing.index) && path.includes(keepClearing.index))
          )
          // but the clearing have an empty slot
          .filter(clearing => clearing.buildings.includes(null));
      }),
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }) {
        return this.send('placeSawmill', { clearing: clearing.index });
      }},
    ));
  }
  const workshopClearing = locate.call(get(game).board, Piece[Faction.marquise].workshop);
  if (!workshopClearing) {
    prompts.set({
      clearings: borrow(game)(game =>
        game.board.clearings
          .filter(clearing =>
            // can select the keep clearing
            clearing.index === keepClearing.index
            // or the connected clearings
            || game.board.paths.some(path => path.includes(clearing.index) && path.includes(keepClearing.index))
          )
          // but the clearing have an empty slot
          .filter(clearing => clearing.buildings.includes(null))
      ),
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }) {
        return this.send('placeWorkshop', { clearing: clearing.index });
      }},
    ));
  }
  const recruiterClearing = locate.call(get(game).board, Piece[Faction.marquise].recruiter);
  if (!recruiterClearing) {
    prompts.set({
      clearings: borrow(game)(game =>
        game.board.clearings
          .filter(clearing =>
            // can select the keep clearing
            clearing.index === keepClearing.index
            // or the connected clearings
            || game.board.paths.some(path => path.includes(clearing.index) && path.includes(keepClearing.index))
          )
          // but the clearing have an empty slot
          .filter(clearing => clearing.buildings.includes(null))
      ),
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }) {
        return this.send('placeRecruiter', { clearing: clearing.index });
      }},
    ));
  }
  prompts.set(null);
}
