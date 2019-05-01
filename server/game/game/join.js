import games from '../../store/games.js';
import Rejection from '../../model/Rejection.js';
import { accept } from '../../model/Acceptor.js';
import ready from './ready.js';
import unready from './unready.js';
import leave, { Leave } from './leave.js';

class GameDoesNotExist extends Rejection {
  constructor(name) {
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
  game.addPlayer(this);
  this.game = game;
  this.respond(threadId, 'update', game);
  while (!game.allReady) {
    try {
      yield * accept.call(this, leave, ready, unready, 'gameUpdated');
      this.send('update', game);
    } catch (e) {
      if (e instanceof Leave) {
        game.removePlayer(this);
        delete this.game;
      }
      throw e;
    }
  }
  this.send('start');
}
