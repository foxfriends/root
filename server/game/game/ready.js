export default async function * ready (_, threadId) {
  if (!this.game) {
    throw new Error('Client is not part of a game');
  }
  this.game.setReady(this, true);
  this.respond(threadId, 'update', this.game);
}
