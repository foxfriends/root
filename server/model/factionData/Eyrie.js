import Leaders from '../Leader.js';
import Faction from '../Faction.js';
import Rejection from '../Rejection.js';
import Piece from '../Piece.js';

class LeaderUnavailable extends Rejection {
  constructor(threadId, leader) {
    super(threadId, {
      key: 'rejection-leader-unavailable',
      params: { leader: `eyrie-leader-${leader}` },
    });
  }
}

export default class Eyrie {
  get faction() { return Faction.eyrie; }
  constructor() {
    this.decree = {
      recruit: [],
      move: [],
      battle: [],
      build: [],
    };

    this[Piece[Faction.eyrie].roost.name] = 7;
    this[Piece[Faction.eyrie].warrior.name] = 20;
    this.leader = null;
    this.leaders = Object.values(Leaders);
    // common stuff
    this.hand = [];
    this.victoryPoints = 0;
    this.dominance = null;
    this.craftedItems = [];
  }

  setLeader(leader, threadId) {
    if (!this.leaders.includes(leader)) {
      throw new LeaderUnavailable(threadId, leader);
    }
    this.leader = leader;
    this.leaders.splice(this.leaders.indexOf(leader), 1);
    if (!this.leaders.length) {
      this.leaders = Object.values(Leaders);
      // TODO: check if this includes the one that is currently in use!
    }
  }
}
