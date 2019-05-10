import { accept, Abort } from '../model/Acceptor';
import start from './start';
import update from './update';
import Client from '../model/Client';

export class Leave extends Abort {}

export default async function * lobby (this: Client) {
  for (;;) {
    yield * accept.call(this,
      update,
      start,
      { type: 'Lobby:leave', async * handler (): AsyncIterableIterator<void> {
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
  }
}
