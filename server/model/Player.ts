export default class Player {
  ready: boolean;
  faction: string | null;

  constructor(public username: string) {
    this.ready = false;
    this.faction = null;
  }
}
