import { Abort } from '../../model/Acceptor.js';

export class Leave extends Abort {}

export default async function * leave () {
  if (!this.game) {
    throw new Error('Client is not part of a game');
  }
  throw new Leave;
}
