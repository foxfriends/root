import Client from '../../model/Client';
import Faction from '../../model/Faction';

export default async function * chooseFaction (this: Client, { faction }: { faction: Faction }, threadId: string): AsyncIterableIterator<void> {
  this.game.setFaction(this, faction, threadId);
  this.respond(threadId, 'update', this.game);
}
