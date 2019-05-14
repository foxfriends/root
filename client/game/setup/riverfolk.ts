import { get } from 'svelte/store';
import borrow from '../../util/borrow';
import { game, prompts } from '../../store';
import { accept } from '../../model/Acceptor';
import Client from '../../model/Client';
import Clearing from '../../model/board/Clearing';
import { ServiceCosts } from '../../model/factionData/Riverfolk';

export default async function * setupRiverfolk(this: Client) {
  borrow(game)(game => {
    const riverClearings = new Set((<number[]> []).concat(...game!.board.rivers));
    prompts.set({
      text: 'prompt-choose-rivers',
      clearings: [...riverClearings].map(index => game!.board.clearings[index]),
    });
  });
  while (get(game)!.factionData.riverfolk!.warrior > 11) {
    game.set(yield * accept.call(this,
      { type: 'Prompts:clearing', async * handler ({ clearing }: { clearing: Clearing }): AsyncIterableIterator<void> {
        return this.send('placeWarrior', { clearing: clearing.index });
      } },
    ));
  }
  prompts.set({
    text: 'prompt-set-prices',
    prices: true,
  });
  game.set(yield * accept.call(this,
    { type: 'Prompts:prices', async * handler (prices: ServiceCosts): AsyncIterableIterator<void> {
      return this.send('setPrices', prices);
    } },
  ));
  prompts.set(null);
}
