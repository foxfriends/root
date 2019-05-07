import { accept } from '../../../model/Acceptor.js';

export default async function * play () {
  for (;;) {
    const currentPlayer = this.game.playerNames[this.game.turn % this.game.playerNames.length];
    if (this.username === currentPlayer) {
      // TODO: take turn
      throw new Error('unimplemented');
    } else {
      yield * accept.call(this, 'gameUpdated');
      this.send('update', this.game);
    }
  }
}
