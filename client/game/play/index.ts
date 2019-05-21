import { get } from 'svelte/store';
import borrow from '../../util/borrow';
import { game, username } from '../../store';
import { accept } from '../../model/Acceptor';
import update from '../update';
import Client from '../../model/Client';
import Faction from '../../model/Faction';

async function * turn (this: Client, faction: Faction): AsyncIterableIterator<void> {
  switch (faction) {
    case Faction.marquise:
      break;
    case Faction.eyrie:
      break;
    case Faction.alliance:
      break;
    case Faction.vagabond:
    case Faction.vagabond2:
      break;
    case Faction.riverfolk:
      break;
    case Faction.cult:
      break;
    default:
      throw new Error('unimplemented');
  }
  yield * accept.call(this, update);
}

export default async function * play (this: Client) {
  for (;;) {
    const currentPlayer = borrow(game)(game => game!.playerNames[game!.turn! % game!.playerNames.length]);
    if (get(username) === currentPlayer) {
      turn.call(this, get(game)!.players[currentPlayer].faction!);
    } else {
      yield * accept.call(this, 'gameUpdated');
      this.send('update', this.game);
    }
  }
}
