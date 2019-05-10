import { get } from 'svelte/store';
import { accept } from '../../model/Acceptor';
import Faction from '../../model/Faction';
import { game, username } from '../../store';
import update from '../update';
import setupEyrie from './eyrie';
import setupMarquise from './marquise';
import Client from '../../model/Client';

async function * setupFaction(this: Client, faction: string) {
  switch (faction) {
    case Faction.marquise:
      yield * setupMarquise.call(this);
      break;
    case Faction.eyrie:
      yield * setupEyrie.call(this);
      break;
    case Faction.alliance:
      // they don't do anything
      break;
    case Faction.vagabond:
    case Faction.vagabond2:
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
    if (currentFaction === myFaction) {
      yield * setupFaction.call(this, currentFaction);
    } else {
      yield * accept.call(this, update);
    }
  }
}
