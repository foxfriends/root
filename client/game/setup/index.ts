import { get } from 'svelte/store';
import { accept } from '../../model/Acceptor';
import Faction from '../../model/Faction';
import { game, username } from '../../store';
import update from '../update';
import setupMarquise from './marquise';
import setupEyrie from './eyrie';
import Client from '../../model/Client';

async function * setupFaction(this: Client, faction: string) {
  switch (faction) {
    case Faction.marquise:
      yield * setupMarquise.call(this);
      break;
    case Faction.eyrie:
      yield * setupEyrie.call(this);
      break;
    default:
      throw new Error('unimplemented');
  }
  yield * accept.call(this, update);
}

export default async function * setup (this: Client) {
  while (get(game)!.turn! < 0) {
    const g = get(game)!;
    const myFaction = g.players[get(username)!].faction;
    const currentFaction = g.factions[g.turn! + g.factions.length];
    console.log(currentFaction);
    if (currentFaction === myFaction) {
      yield * setupFaction.call(this, currentFaction);
    } else {
      yield * accept.call(this, update);
    }
  }
}
