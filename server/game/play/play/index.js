export default async function * play () {
  for (;;) {
    const currentPlayer = this.game.playerNames[this.game.turn % this.game.playerName.length];
    if (this.username === currentPlayer) {
      // TODO: take turn
    } else {
      yield * accept.call(this, 'gameUpdated');
      this.send('update', this.game);
    }
  }
}
