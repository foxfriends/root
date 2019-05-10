import { accept } from '../../../model/Acceptor';
import Faction from '../../../model/Faction';
import Client from '../../../model/Client';
import setupMarquise from './marquise';
import setupEyrie from './eyrie';

async function * setupFaction(this: Client, faction: string) {
  switch (faction) {
    case Faction.marquise:
      yield * setupMarquise.call(this);
      break;
    case Faction.eyrie:
      yield * setupEyrie.call(this);
      break;
    case Faction.eyrie:
      break;
  }
}

export default async function * setup (this: Client) {
  while (this.game.turn! < 0) {
    const myFaction = this.game.players[this.username].faction;
    const currentFaction = this.game.factions[this.game.turn! + this.game.factions.length];
    console.log(`${this.username} checking ${myFaction} / ${currentFaction}`);
    if (myFaction === currentFaction) {
      console.log(`${this.username} starting. turn = ${this.game.turn}`);
      yield * setupFaction.call(this, currentFaction);
      console.log(`here`);
      this.game.nextTurn();
      console.log(`${this.username} ending. turn = ${this.game.turn}`);
    } else {
      console.log(`${this.username} waiting. turn = ${this.game.turn}`);
      yield * accept.call(this, 'gameUpdated');
      console.log(`${this.username} continuing. turn = ${this.game.turn}`);
    }
    this.send('update', this.game);
  }
}
