import Client from '../../../model/Client';

export default async function * setupEyrie(this: Client): AsyncIterableIterator<void> {
  this.game.factionData.alliance.drawSupporter(this.game, 3);
}
