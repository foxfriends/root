export default async function * unready (_, threadId) {
  if (!this.game) {
    throw new Error('Client is not part of a game');
  }
  this.game.setReady(this, false, threadId);
  this.respond(threadId, 'update', this.game);
}
