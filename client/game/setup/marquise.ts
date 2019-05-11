import { get } from 'svelte/store';
import borrow from '../../util/borrow';
import { game, prompts } from '../../store';
import { accept } from '../../model/Acceptor';
import locate from '../../util/locate';
import Piece from '../../model/Piece';
import Client from '../../model/Client';
import Clearing from '../../model/board/Clearing';

export default async function * setupMarquise(this: Client) {
  let keepClearing = locate.call(get(game)!.board, Piece.marquise.keep);
  if (!keepClearing) {
    prompts.set({
      text: 'prompt-place-keep',
      clearings: get(game)!.board.clearings
        .filter(clearing => clearing.isCorner)
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }: { clearing: Clearing }) {
        keepClearing = clearing;
        return this.send('placeKeep', { clearing: clearing.index });
      }},
    ));
  }

  const sawmillClearing = locate.call(get(game)!.board, Piece.marquise.sawmill);
  if (!sawmillClearing) {
    prompts.set({
      text: {
        key: 'prompt-place-building',
        params: { building: 'marquise-sawmill' },
      },
      clearings: borrow(game)(game => game!.board.clearings
        .filter(clearing =>
          // can select the keep clearing
          clearing.index === keepClearing.index
          // or the connected clearings
          || game!.board.paths.some(path => path.includes(clearing.index) && path.includes(keepClearing.index))
        )
        // but the clearing have an empty slot
        .filter(clearing => clearing.buildings.includes(null))
      ),
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }: { clearing: Clearing }) {
        return this.send('placeSawmill', { clearing: clearing.index });
      }},
    ));
  }
  const workshopClearing = locate.call(get(game)!.board, Piece.marquise.workshop);
  if (!workshopClearing) {
    prompts.set({
      text: {
        key: 'prompt-place-building',
        params: { building: 'marquise-workshop' },
      },
      clearings: borrow(game)(game => game!.board.clearings
        .filter(clearing =>
          // can select the keep clearing
          clearing.index === keepClearing.index
          // or the connected clearings
          || game!.board.paths.some(path => path.includes(clearing.index) && path.includes(keepClearing.index))
        )
        // but the clearing have an empty slot
        .filter(clearing => clearing.buildings.includes(null))
      ),
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }: { clearing: Clearing }) {
        return this.send('placeWorkshop', { clearing: clearing.index });
      }},
    ));
  }
  const recruiterClearing = locate.call(get(game)!.board, Piece.marquise.recruiter);
  if (!recruiterClearing) {
    prompts.set({
      text: {
        key: 'prompt-place-building',
        params: { building: 'marquise-recruiter' },
      },
      clearings: borrow(game)(game => game!.board.clearings
        .filter(clearing =>
          // can select the keep clearing
          clearing.index === keepClearing.index
          // or the connected clearings
          || game!.board.paths.some(path => path.includes(clearing.index) && path.includes(keepClearing.index))
        )
        // but the clearing have an empty slot
        .filter(clearing => clearing.buildings.includes(null))
      ),
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }: { clearing: Clearing }) {
        return this.send('placeRecruiter', { clearing: clearing.index });
      }},
    ));
  }
  prompts.set(null);
}
