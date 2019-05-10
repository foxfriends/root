import { Abort } from '../../model/Acceptor';
import Client from '../../model/Client';

export class Leave extends Abort {}

export default async function * leave (this: Client, _: {}, threadId: string): AsyncIterableIterator<void> {
  if (!this.game) {
    throw new Error('Client is not part of a game');
  }
  this.game.removePlayer(this, threadId);
  delete this.game;
  throw new Leave;
}
