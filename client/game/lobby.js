import { accept, Abort } from '../model/Acceptor';
import { game as gameStore } from '../store';

export class Leave extends Abort {}

export default async function * lobby ({ game }) {
  while (!game.allReady) {
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
    );
    gameStore.set(game);
  }
}
