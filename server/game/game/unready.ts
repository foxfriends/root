import Client from '../../model/Client';

export default async function * unready (this: Client, _: {}, threadId: string): AsyncIterableIterator<void> {
  if (!this.game) {
    throw new Error('Client is not part of a game');
  }
  this.game.setReady(this, false, threadId);
  this.respond(threadId, 'update', this.game);
}
