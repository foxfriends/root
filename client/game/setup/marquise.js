import { get } from 'svelte/store';
import { game, prompts } from '../../store';
import { accept } from '../../model/Acceptor';

export default async function * setupMarquise() {
  prompts.set({
    clearings: get(game).board.clearings
      .map((clearing, index) => [clearing, index])
      .filter(([clearing]) => clearing.isCorner)
      .map(([, index]) => index),
  });
  yield * accept.call(this,
    { type: 'Prompts:clearing', async * handler ({ clearing }) {
      return this.send('placeKeep', { clearing });
    }},
  );
}
