import { game as gameStore } from '../store';
import Client from '../model/Client';
import Game from '../model/Game';

export default async function * update (this: Client, game: Game): AsyncIterableIterator<void> {
  gameStore.set(game);
}
