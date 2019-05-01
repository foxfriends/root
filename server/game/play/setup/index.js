export default async function * setup () {
  while (this.game.turn < 0) {
    const myFaction = this.game.players[this.username].faction;
    const currentFaction = this.game.factions[this.game.turn + this.game.factions.length];
    if (faction === currentFaction) {
    } else {
      yield * accept.call(this, 'gameUpdated');
      this.send('update', this.game);
    }
  }
}
