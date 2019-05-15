import { get } from 'svelte/store';
import { game, prompts } from '../../store';
import { accept } from '../../model/Acceptor';
import locate from '../../util/locate';
import Client from '../../model/Client';
import Piece from '../../model/Piece';
import Suit from '../../model/Suit';
import Clearing from '../../model/board/Clearing';

export default async function * setupCult(this: Client) {
  if (!locate.call(get(game)!.board, Piece.cult.warrior)) {
    const keepClearing = locate.call(get(game)!.board, Piece.marquise.keep);
    const eyrieClearing = locate.call(get(game)!.board, Piece.eyrie.roost);
    if ((keepClearing && eyrieClearing) || (!keepClearing && !eyrieClearing)) {
      // both or neither, pick a different clearing
      prompts.set({
        text: 'prompt-choose-starting-clearing',
        clearings: get(game)!.board.clearings
          .filter(clearing => clearing.isCorner)
          .filter(clearing => !keepClearing || clearing.index !== keepClearing.index)
          .filter(clearing => !eyrieClearing || clearing.index !== eyrieClearing.index),
      });
      game.set(yield * accept.call(this,
        { type: 'Prompts:clearing', async * handler ({ clearing }: { clearing: Clearing }) {
          return this.send('chooseClearing', { clearing: clearing.index });
        } },
      ));
    }
  }
  // pick intial outcast
  prompts.set({
    text: 'prompt-choose-first-outcast',
    outcast: true,
  });
  game.set(yield * accept.call(this,
    { type: 'Prompts:outcast', async * handler ({ outcast }: { outcast: Suit }) {
      return this.send('chooseOutcast', { outcast });
    } },
  ));
  prompts.set(null);
}
