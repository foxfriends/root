import { accept } from '../model/Acceptor';
import { game as gameStore } from '../store';

export default async function * chooseGame() {
  const game = yield * accept.call(this,
    { type: 'CreateGameForm:create', async * handler ({ name, settings }) {
      return this.send('create', { name, settings });
    }},
    { type: 'JoinGameForm:join', async * handler ({ name }) {
      return this.send('join', { name });
    }},
  );
  gameStore.set(game);
  return game;
}
