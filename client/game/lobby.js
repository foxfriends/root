import { get } from 'svelte/store';
import { accept, Abort } from '../model/Acceptor';
import { game as gameStore } from '../store';
import start from './start';
import update from './update';

export class Leave extends Abort {}

export default async function * lobby () {
  for (;;) {
    yield * accept.call(this,
      update,
      start,
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
  }
}
