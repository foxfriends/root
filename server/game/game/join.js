import games from '../../store/games.js';
import { Rejection, accept } from '../runtime.js';

class GameDoesNotExist extends Rejection {
  constructor(name) {
    super(`A game named ${name} does not exist.`);
  }
}

export default async function * join ({ name }) {
  const game = games.get(name);
  if (!game) {
    throw new GameDoesNotExist(name);
  }
  game.addPlayer(this);
  this.game = game;
  this.respond('update', game);
  while (!game.allReady) {
    try {
      yield * accept.call(this, leave, ready, unready, 'gameUpdated');
      this.send('update', game);
    } catch (e) {
      if (e instanceof Leave) {
        game.removePlayer(this);
        delete this.game;
        throw e;
      }
    }
  }
  this.send('start');
}
