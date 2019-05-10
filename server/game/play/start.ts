import { accept } from '../../model/Acceptor';
import Client from '../../model/Client';
import chooseFaction from './chooseFaction';
import setup from './setup/index';
import play from './play/index';

export default async function * start (this: Client) {
  // let manual faction choice happen if this player has not yet
  while (this.game.players[this.username].faction === null) {
    yield * accept.call(this, chooseFaction, 'gameUpdated');
    this.send('update', this.game);
  }
  // then enter setup if needed
  if (this.game.turn! < 0) {
    yield * setup.call(this);
  }
  // then play the game
  yield * play.call(this);
}
