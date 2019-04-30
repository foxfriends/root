export default async function * ready () {
  if (!this.game) {
    throw new Error('Client is not part of a game');
  }
  game.setReady(this, true);
}
