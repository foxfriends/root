import { get } from 'svelte/store';
import { accept } from '../model/Acceptor';
import Client from '../model/Client';
import { game, username, screen } from '../store';
import setup from './setup';
import play from './play';
import update from './update';

export default async function * start (this: Client) {
  screen.set('board');
  while (!get(game).players[get(username)].faction) {
    yield * accept.call(this,
      update,
      { type: 'FactionPicker:chooseFaction', async * handler ({ faction }) {
        return this.send('chooseFaction', { faction });
      }},
    );
  }
  if (get(game).turn < 0) {
    yield * setup.call(this);
  }
  yield * play.call(this);
}
