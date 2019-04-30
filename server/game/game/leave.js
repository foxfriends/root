import { Abort } from '../../model/Acceptor.js';

export class Leave extends Abort {}

export default async function * ready () {
  if (!this.game) {
    throw new Error('Client is not part of a game');
  }
  game.removePlayer(client);
  throw new Leave;
}
