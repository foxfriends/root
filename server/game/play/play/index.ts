import { accept } from '../../../model/Acceptor';
import Faction from '../../../model/Faction';
import Client from '../../../model/Client';

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
}

export default async function * play (this: Client) {
  for (;;) {
    const currentPlayer = this.game.playerNames[this.game.turn! % this.game.playerNames.length];
    if (this.username === currentPlayer) {
      // TODO: take turn
      turn.call(this, this.game.players[currentPlayer].faction!);
      this.game.nextTurn();
    } else {
      yield * accept.call(this, 'gameUpdated');
      this.send('update', this.game);
    }
  }
}
