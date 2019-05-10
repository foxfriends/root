import Client from '../model/Client';

export default async function * identify (this: Client, { username }: { username: string }, threadId: string): AsyncIterableIterator<void> {
  this.username = username;
  this.respond(threadId);
}
