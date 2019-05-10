import { accept } from '../../../model/Acceptor';
import Faction from '../../../model/Faction';
import Client from '../../../model/Client';
import setupAlliance from './alliance';
import setupEyrie from './eyrie';
import setupMarquise from './marquise';

async function * setupFaction(this: Client, faction: string) {
  switch (faction) {
    case Faction.marquise:
      yield * setupMarquise.call(this);
      break;
    case Faction.eyrie:
      yield * setupEyrie.call(this);
      break;
    case Faction.alliance:
      yield * setupAlliance.call(this);
      break;
    default:
      throw new Error('unimplemented');
  }
}

export default async function * setup (this: Client) {
  while (this.game.turn! < 0) {
    const myFaction = this.game.players[this.username].faction;
    const currentFaction = this.game.factions[this.game.turn! + this.game.factions.length];
    if (myFaction === currentFaction) {
      yield * setupFaction.call(this, currentFaction);
      this.game.nextTurn();
    } else {
      yield * accept.call(this, 'gameUpdated');
    }
    this.send('update', this.game);
  }
}
