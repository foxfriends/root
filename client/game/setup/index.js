import { get } from 'svelte/store';
import { accept } from '../../model/Acceptor';
import { game, username } from '../../store';
import update from '../update';

export default async function * setup () {
  while (get(game).turn < 0) {
    const g = get(game);
    const myFaction = g.players[get(username)].faction;
    const currentFaction = g.factions[g.turn + g.factions.length];
    if (currentFaction === myFaction) {
      // TODO: setup
      throw new Error('unimplemented');
    } else {
      yield * accept.call(this, update);
    }
  }
}
