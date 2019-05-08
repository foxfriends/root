import { get } from 'svelte/store';
import { game, prompts } from '../../store';
import { accept } from '../../model/Acceptor';
import locate from '../../util/locate';
import Faction from '../../model/Faction';
import Piece from '../../model/Piece';

export default async function * setupMarquise() {
  // TODO: pick leader
  const keepClearing = locate.call(get(game).board, Piece[Faction.marquise].keep);
  if (!keepClearing) {
    prompts.set({
      text: 'prompt-choose-starting-clearing',
      clearings: get(game).board.clearings
        .filter(clearing => clearing.isCorner)
    });
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }) {
        return this.send('eyrieClearing', { clearing: clearing.index });
      }},
    ));
  }
}
