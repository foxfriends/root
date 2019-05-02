import Player from './Player.js';
import clients from '../store/clients.js';
import games from '../store/games.js';
import Faction from './Faction.js';
import Rejection from './Rejection.js';
import Message from './Message.js';
import Forest from './board/Forest.js';
import GameMap from './GameMap.js';
import shuffle from '../util/shuffle.js';

class UnsupportedSettings extends Error {
  constructor(settings) {
    super(`The requested game settings are not supported: ${JSON.stringify(settings)}`);
  }
}

class GameIsFull extends Rejection {
  constructor(threadId, name) {
    super(threadId, {
      key: 'rejection-game-is-full',
      params: { name },
    });
  }
}

class PlayerAlreadyJoined extends Rejection {
  constructor(threadId, gameName, playerName) {
    super(threadId, {
      key: 'rejection-player-already-joined',
      params: { gameName, playerName },
    });
  }
}

class InvalidPlayer extends Rejection {
  constructor(threadId, gameName, playerName) {
    super(threadId, {
      key: 'rejection-invalid-player',
      params: { gameName, playerName },
    });
  }
}

class GameAlreadyStarted extends Rejection {
  constructor(threadId, gameName) {
    super(threadId, {
      key: 'rejection-game-already-started',
      params: { gameName },
    })
  }
}

class IllegalFaction extends Rejection {
  constructor(threadId, faction) {
    super(threadId, {
      key: 'rejection-illegal-faction',
      params: { faction },
    })
  }
}

class FactionTaken extends Rejection {
  constructor(threadId, faction, playerName) {
    super(threadId, {
      key: 'rejection-faction-taken',
      params: { faction, playerName },
    })
  }
}

export default class Game {
  constructor(name, {
    factions = [Faction.marquise, Faction.eyrie, Faction.alliance, Faction.vagabond],
    assignment = 'auto',
    map = GameMap.forest,
  } = {}) {
    /** Game name */
    this.name = name;
    /** Usernames of players */
    this.playerNames = [];
    /** Client IDs of the players (map of username to client id) */
    this._clients = {};
    /** Enabled factions */
    this.factions = factions;
    if (!this.factions.every(faction => faction in Faction)) {
      throw new UnsupportedSettings({ factions, assignment, map });
    }
    /** How players are to be assigned factions (auto or manual) */
    this.assignment = assignment;
    /** The actual player data for each named player */
    this.players = {};
    /** The current turn number, negative for setup, or null if not started */
    this.turn = null;
    /** The state of the board */
    switch (map) {
      case GameMap.forest:
        this.board = new Forest();
        break;
      case GameMap.winter:
        throw new Error('unimplemented');
      default:
        throw new UnsupportedSettings({ factions, assignment, map });
    }
  }

  get clients() {
    return Object.values(this._clients)
      .map(clientId => clients.get(clientId))
      .filter(Boolean);
  }

  notify() {
    for (const client of this.clients) {
      client.notify(Message.direct('gameUpdated'));
    }
  }

  addPlayer(client, threadId) {
    if (this.isFull) {
      throw new GameIsFull(threadId, this.name);
    }
    if (this.playerNames.includes(client.username)) {
      throw new PlayerAlreadyJoined(threadId, this.name, client.username);
    }
    this.playerNames.push(client.username);
    this.players[client.username] = new Player(client.username);
    this.addClient(client, threadId);
  }

  addClient(client, threadId) {
    if (!this.players[client.username]) {
      throw new InvalidPlayer(threadId, this.name, client.username);
    }
    this._clients[client.username] = client.id;
    this.notify();
  }

  removePlayer(client, threadId) {
    if (this.turn !== null) {
      throw new GameAlreadyStarted(threadId, this.name);
    }
    const playerIndex = this.playerNames.indexOf(client.username);
    if (playerIndex === -1) {
      throw new InvalidPlayer(threadId, this.name, client.username);
    }
    this.removeClient(client);
    this.playerNames.splice(playerIndex, 1);
    delete this.players[client.username];
    this.notify();
    if (this.playerNames.length === 0) {
      console.log(`Discarding game ${this.name}`)
      games.delete(this.name);
    }
  }

  removeClient(client) {
    delete this.clients[client.username];
    this.notify();
  }

  setReady(client, ready, threadId) {
    if (!this.players[client.username]) {
      throw new InvalidPlayer(threadId, this.name, client.username);
    }
    this.players[client.username].ready = ready;
    // shuffle players for random turn order
    if (this.allReady) {
      this.playerNames = shuffle(this.playerNames);
      // set the turn to negative for setup turn
      this.turn = -this.factions.length;
      if (this.assignment === 'auto') {
        // shuffle factions for random assignment
        const factions = shuffle(this.factions);
        // assign factions
        for (let i = 0; i < factions.length; ++i) {
          this.players[this.playerNames[i]].faction = factions[i];
        }
      }
    }
    this.notify();
  }

  setFaction(client, faction, threadId) {
    if (!this.players[client.username]) {
      throw new InvalidPlayer(threadId, this.name, client.username);
    }
    if (!this.factions.includes(faction)) {
      throw new IllegalFaction(threadId, faction);
    }
    const takenBy = Object.values(this.players)
      .find(player => player.faction === faction)
    if (takenBy) {
      throw new FactionTaken(threadId, faction, takenBy.username);
    }
    this.players[client.username].faction = faction;
    this.notify();
  }

  get isFull() {
    return this.playerNames.length === this.factions.length;
  }

  get allReady() {
    return Object.values(this.players).every(player => player.ready) && this.isFull;
  }

  toJSON() {
    const object = { ...this };
    delete object._clients;
    return object;
  }
}
