import { Abort } from '../../model/Acceptor.js';

export class Leave extends Abort {}

export default async function * leave (_, threadId) {
  if (!this.game) {
    throw new Error('Client is not part of a game');
  }
  this.game.removePlayer(this, threadId);
  delete this.game;
  throw new Leave;
}
