import Client from '../../model/Client';

export default async function * chooseFaction (this: Client, { faction }: { faction: string }, threadId: string): AsyncIterableIterator<void> {
  this.game.setFaction(this, faction, threadId);
  this.respond(threadId, 'update', this.game);
}
