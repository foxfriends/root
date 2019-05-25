import clients from '../store/clients';
import games from '../store/games';
import Player from './Player';
import Client from './Client';
import Faction from './Faction';
import Board from './board/Board';
import Cards, { Card } from './Card';
import Items, { Item } from './Item';
import Quests, { Quest } from './Quest';
import Rejection from './Rejection';
import Message from './Message';
import Forest from './board/Forest';
import GameMap from './GameMap';
import Time from './Time';
import shuffle from '../util/shuffle';
import createFaction from './factionData';

import Alliance from './factionData/Alliance';
import Cult from './factionData/Cult';
import Eyrie from './factionData/Eyrie';
import Marquise from './factionData/Marquise';
import MarquiseBot from './factionData/MarquiseBot';
import Riverfolk from './factionData/Riverfolk';
import Vagabond from './factionData/Vagabond';

type Assignment = 'auto' | 'manual';
export type Settings = {
  factions?: Faction[],
  assignment?: Assignment,
  map?: GameMap,
};

class PoorManualDexterity extends Error {
  constructor() {
    super('The Mechanical Marquise cannot draw cards');
  }
}

class UnsupportedSettings extends Error {
  constructor(settings: Settings) {
    super(`The requested game settings are not supported: ${JSON.stringify(settings)}`);
  }
}

class GameIsFull extends Rejection {
  constructor(threadId: string, name: string) {
    super(threadId, {
      key: 'rejection-game-is-full',
      params: { name },
    });
  }
}

class PlayerAlreadyJoined extends Rejection {
  constructor(threadId: string, gameName: string, playerName: string) {
    super(threadId, {
      key: 'rejection-player-already-joined',
      params: { gameName, playerName },
    });
  }
}

class InvalidPlayer extends Rejection {
  constructor(threadId: string, gameName: string, playerName: string) {
    super(threadId, {
      key: 'rejection-invalid-player',
      params: { gameName, playerName },
    });
  }
}

class GameAlreadyStarted extends Rejection {
  constructor(threadId: string, gameName: string) {
    super(threadId, {
      key: 'rejection-game-already-started',
      params: { gameName },
    })
  }
}

class IllegalFaction extends Rejection {
  constructor(threadId: string, faction: Faction) {
    super(threadId, {
      key: 'rejection-illegal-faction',
      params: { faction },
    })
  }
}

class FactionTaken extends Rejection {
  constructor(threadId: string, faction: Faction, playerName: string) {
    super(threadId, {
      key: 'rejection-faction-taken',
      params: { faction, playerName },
    })
  }
}

export default class Game {
  name: string;
  assignment: Assignment;
  _clients: { [id: string]: string };
  playerNames: string[];
  factions: Faction[];
  factionData: {
    marquise?: Marquise,
    eyrie?: Eyrie,
    alliance?: Alliance,
    vagabond?: Vagabond,
    vagabond2?: Vagabond,
    cult?: Cult,
    riverfolk?: Riverfolk,
    marquise_bot?: MarquiseBot,
  };
  players: { [username: string]: Player };

  turn: number | null;
  time: Time;
  phase: number;
  services: {
    riverboats: boolean,
    mercenaries: boolean,
  };

  cards: Card[];
  discards: Card[];
  quests: Quest[];
  items: Item[];
  questsAvailable: Quest[];
  board: Board;

  constructor(name: string, {
    factions = [Faction.marquise, Faction.eyrie, Faction.alliance, Faction.vagabond],
    assignment = 'auto',
    map = GameMap.forest,
  }: Settings = {}) {
    /** Game name */
    this.name = name;
    /** Usernames of players */
    this.playerNames = [];
    /** Client IDs of the players (map of username to client id) */
    this._clients = {};
    /** Enabled factions */
    this.factions = factions;
    /** Faction data for the factions above */
    this.factionData = <any> factions // casting because this is cool
      .map(faction => createFaction(faction))
      .reduce((collection, faction) => Object.assign(collection, { [faction.faction]: faction }), {});
    /** How players are to be assigned factions (auto or manual) */
    this.assignment = assignment;
    /** The actual player data for each named player */
    this.players = {};
    /** The current turn number, negative for setup, or null if not started */
    this.turn = null;
    this.time = Time.birdsong;
    this.phase = 0;
    /** The Riverfolk services purchased by the current player **/
    this.services = { riverboats: false, mercenaries: false };
    /** The cards still in the deck */
    this.cards = shuffle(factions.includes(Faction.marquise_bot)
      ? Cards.filter(card => !Card.isDominance(card))
      : Cards.filter(card => !Card.isSpy(card))
    );
    /** The cards that have been discarded */
    this.discards = [];
    /** The unturned quests */
    this.quests = shuffle([...Quests]);
    /** The items ready for pickup */
    this.items = [...Items];
    /** The active quests */
    this.questsAvailable = []
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

  get clients(): Client[] {
    return Object.values(this._clients)
      .map(clientId => clients.get(clientId))
      .filter((client: Client |undefined): client is Client => !!client);
  }

  notify() {
    for (const client of this.clients) {
      client.notify(Message.direct('gameUpdated'));
    }
  }

  addPlayer(client: Client, threadId: string) {
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

  addClient(client: Client, threadId: string) {
    if (!this.players[client.username]) {
      throw new InvalidPlayer(threadId, this.name, client.username);
    }
    this._clients[client.username] = client.id;
    this.notify();
  }

  removePlayer(client: Client, threadId?: string) {
    if (this.turn !== null) {
      if (!threadId) { return; }
      throw new GameAlreadyStarted(threadId, this.name);
    }
    const playerIndex = this.playerNames.indexOf(client.username);
    if (playerIndex === -1) {
      if (!threadId) { return; }
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

  removeClient(client: Client) {
    delete this._clients[client.username];
    this.notify();
  }

  setReady(client: Client, ready: boolean, threadId: string) {
    this.batchUpdates(() => {
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
        for (const faction of this.factions) {
          try {
            this.drawCard(faction, 3, threadId);
          } catch (e) {
            if (e instanceof PoorManualDexterity) {
              // this is expected
              continue;
            }
            throw e;
          }
        }
      }
    });
  }

  setFaction(client: Client, faction: Faction, threadId: string) {
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

  nextTurn() {
    ++this.turn!;
    this.time = Time.birdsong;
    this.phase = 0;
    this.services = {
      riverboats: false,
      mercenaries: false,
    };
    this.notify();
  }

  nextTime(time: Time) {
    this.time = time;
    this.phase = 0;
    this.notify();
  }

  nextPhase() {
    ++this.phase;
    this.notify();
  }

  takeCards(count: number = 1): Card[] {
    const drawn = this.cards.splice(0, count);
    if (drawn.length !== count) {
      this.cards = shuffle(this.discards);
      this.discards = [];
      return [...drawn, ...this.takeCards(count - drawn.length)];
    }
    return drawn;
  }

  drawCard(faction: Faction, count: number = 1, threadId: string) {
    const factionData = this.factionData[faction];
    if (!factionData) {
      throw new IllegalFaction(threadId, faction);
    }
    if (factionData instanceof MarquiseBot) {
      throw new PoorManualDexterity;
    }
    const cards = this.takeCards(count);
    factionData.hand.push(...cards)
    this.notify();
  }

  discard(card: Card) {
    if (this.factions.includes(Faction.cult)) {
      this.factionData.cult!.lostSouls.push(card);
    } else {
      this.discards.push(card);
    }
    this.notify();
  }

  get isFull() {
    return this.playerNames.length === this.factions.filter(faction => faction !== Faction.marquise_bot).length;
  }

  get allReady() {
    return Object.values(this.players).every(player => player.ready) && this.isFull;
  }

  toJSON() {
    const object: any = { ...this };
    delete object._clients;
    object.cards = this.cards.length;
    object.quests = this.quests.length;
    return object;
  }

  batchUpdates(handler: () => any) {
    this.notify = () => {};
    try {
      handler();
    } finally {
      delete this.notify;
      this.notify();
    }
  }
}
