import games from '../../store/games.js';
import Rejection from '../../model/Rejection.js';
import { accept } from '../../model/Acceptor.js';
import ready from './ready.js';
import unready from './unready.js';
import leave, { Leave } from './leave.js';
import start from '../play/start.js';

class GameDoesNotExist extends Rejection {
  constructor(threadId, name) {
    super(threadId, {
      key: 'rejection-game-does-not-exist',
      params: { name },
    });
  }
}

export default async function * join ({ name }, threadId) {
  const game = games.get(name);
  if (!game) {
    throw new GameDoesNotExist(threadId, name);
  }
  if (game.turn === null) {
    game.addPlayer(this, threadId);
  } else {
    game.addClient(this, threadId);
  }
  this.game = game;
  this.respond(threadId, 'update', game);
  if (typeof game.turn !== 'number') {
    // if game is not yet started, enter lobby until everyone is ready
    while (!game.allReady) {
      yield * accept.call(this, leave, ready, unready, 'gameUpdated');
      this.send('update', game);
    }
    this.send('start');
  }
  // start the game
  yield * start.call(this);
}
