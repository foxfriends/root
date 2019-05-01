import { accept, Abort } from '../model/Acceptor';
import { game as gameStore } from '../store';
import start from './start';

export class Leave extends Abort {}

export default async function * lobby ({ game }) {
  for (;;) {
    game = yield * accept.call(this,
      'update',
      { type: 'Lobby:leave', async * handler () {
        this.send('leave');
        throw new Leave;
      }},
      { type: 'Lobby:ready', async * handler () {
        return this.send('ready');
      }},
      { type: 'Lobby:unready', async * handler () {
        return this.send('unready');
      }},
      start,
    );
    if (!game) {
      throw new Leave;
    }
    gameStore.set(game);
  }
}
