import Faction from './Faction';

export default class Player {
  ready: boolean;
  faction: Faction | null;

  constructor(public username: string) {
    this.ready = false;
    this.faction = null;
  }
}
