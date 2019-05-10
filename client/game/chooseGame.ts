import { accept } from '../model/Acceptor';
import { game as gameStore } from '../store';
import { Settings } from '../model/Game';
import Client from '../model/Client';

export default async function * chooseGame(this: Client) {
  const game = yield * accept.call(this,
    { type: 'CreateGameForm:create', async * handler ({ name, settings }: { name: string, settings: Settings }) {
      return this.send('create', { name, settings });
    }},
    { type: 'JoinGameForm:join', async * handler ({ name }: { name: string }) {
      return this.send('join', { name });
    }},
  );
  gameStore.set(game);
  return game;
}
