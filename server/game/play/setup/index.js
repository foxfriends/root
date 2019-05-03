import { accept } from '../../../model/Acceptor.js';
import Faction from '../../../model/Faction.js';
import setupMarquise from './marquise.js';

async function * setupFaction(faction) {
  switch (faction) {
    case Faction.marquise:
      yield * setupMarquise.call(this);
      break;
    case Faction.eyrie:
      break;
  }
  this.game.nextTurn();
}

export default async function * setup () {
  while (this.game.turn < 0) {
    const myFaction = this.game.players[this.username].faction;
    const currentFaction = this.game.factions[this.game.turn + this.game.factions.length];
    if (myFaction === currentFaction) {
      yield * setupFaction.call(this, currentFaction);
    } else {
      yield * accept.call(this, 'gameUpdated');
      this.send('update', this.game);
    }
  }
}
