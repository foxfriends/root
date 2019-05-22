import Client from '../../../model/Client';
import Faction from '../../../model/Faction';

export async function * birdsong (this: Client, faction: Faction): AsyncIterableIterator<void> {
  // TODO: check victory conditions
  if (this.game.factions.includes(Faction.riverfolk) && faction !== Faction.riverfolk) {
    // TODO: purchase services
  }
  // TODO: activate crafted effects
  this.game.nextPhase();
}

export async function * daylight (this: Client, faction: Faction): AsyncIterableIterator<void> {
  // TODO: activate crafted effects
  this.game.nextPhase();
}

export async function * evening (this: Client, faction: Faction): AsyncIterableIterator<void> {
  // TODO: activate crafted effects
  this.game.nextPhase();
}
