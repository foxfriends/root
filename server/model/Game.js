import Player from './Player.js';
import clients from '../store/clients.js';
import games from '../store/games.js';
import Faction from './Faction.js';
import Rejection from './Rejection.js';
import Message from './Message.js';

class GameIsFull extends Rejection {
  // TODO: threadId is not defined
  constructor(name) {
    super(threadId, {
      key: 'rejection-game-is-full',
      params: { name },
    });
  }
}

class PlayerAlreadyJoined extends Rejection {
  constructor(gameName, playerName) {
    super(threadId, {
      key: 'rejection-player-already-joined',
      params: { gameName, playerName },
    });
  }
}

class InvalidPlayer extends Rejection {
  constructor(gameName, playerName) {
    super(threadId, {
      key: 'rejection-invalid-player',
      params: { gameName, playerName },
    });
  }
}

export default class Game {
  constructor(name, {
    factions = [Faction.marquise, Faction.eyrie, Faction.alliance, Faction.vagabond],
    assignment = 'auto',
  } = {}) {
    /** Game name */
    this.name = name;
    /** Usernames of players */
    this.playerNames = [];
    /** Client IDs of the players (map of username to client id) */
    this._clients = {};
    /** Enabled factions */
    this.factions = factions;
    /** How players are to be assigned factions (auto or manual) */
    this.assignment = assignment;
    /** The actual player data for each named player */
    this.players = {};
    /** Whether this game has begun yet or not */
    this.started = false;
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

  addPlayer(client) {
    if (this.isFull) {
      throw new GameIsFull(this.name);
    }
    if (this.playerNames.includes(client.username)) {
      throw new PlayerAlreadyJoined(this.name, client.username);
    }
    this.playerNames.push(client.username);
    this.players[client.username] = new Player;
    this.addClient(client);
  }

  addClient(client) {
    if (!this.players[client.username]) {
      throw new InvalidPlayer(this.name, client.username);
    }
    this._clients[client.username] = client.id;
    this.notify();
  }

  removePlayer(client) {
    const playerIndex = this.playerNames.indexOf(client.username);
    if (playerIndex === -1) {
      throw new InvalidPlayer(this.name, client.username);
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

  setReady(client, ready) {
    if (!this.players[client.username]) {
      throw new InvalidPlayer(this.name, client.username);
    }
    this.players[client.username].ready = ready;
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
    object.isFull = this.isFull;
    object.allReady = this.allReady;
    return object;
  }
}
