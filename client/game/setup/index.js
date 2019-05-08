import { get } from 'svelte/store';
import { accept } from '../../model/Acceptor';
import Faction from '../../model/Faction';
import { game, username } from '../../store';
import update from '../update';
import setupMarquise from './marquise';
import setupEyrie from './eyrie';

async function * setupFaction(faction) {
  switch (faction) {
    case Faction.marquise:
      yield * setupMarquise.call(this);
      return;
    case Faction.eyrie:
      yield * setupEyrie.call(this);
    default:
      throw new Error('unimplemented');
  }
}

export default async function * setup () {
  while (get(game).turn < 0) {
    const g = get(game);
    const myFaction = g.players[get(username)].faction;
    const currentFaction = g.factions[g.turn + g.factions.length];
    if (currentFaction === myFaction) {
      yield * setupFaction.call(this, currentFaction);
    } else {
      yield * accept.call(this, update);
    }
  }
}
