import { accept } from '../../model/Acceptor.js';
import chooseFaction from './chooseFaction.js';
import setup from './setup/index.js';
import play from './play/index.js';

export default async function * start () {
  // let manual faction choice happen if this player has not yet
  while (this.game.players[this.username].faction === null) {
    yield * accept.call(this, chooseFaction, 'gameUpdated');
    this.send('update', this.game);
  }
  // then enter setup if needed
  if (this.game.turn < 0) {
    yield * setup.call(this);
  }
  // then play the game
  yield * play.call(this);
}
