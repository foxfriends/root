export default async function * chooseFaction ({ faction }, threadId) {
  this.game.setFaction(this, faction, threadId);
}
