import { accept } from '../../../model/Acceptor';
import Client from '../../../model/Client';

export default async function * play (this: Client) {
  for (;;) {
    const currentPlayer = this.game.playerNames[this.game.turn! % this.game.playerNames.length];
    if (this.username === currentPlayer) {
      // TODO: take turn
      throw new Error('unimplemented');
    } else {
      yield * accept.call(this, 'gameUpdated');
      this.send('update', this.game);
    }
  }
}
