import games from '../../store/games.js';
import join from './join.js';
import Rejection from '../../model/Rejection.js';
import Game from '../../model/Game.js';

class GameAlreadyExists extends Rejection {
  constructor(threadId, name) {
    super(threadId, `A game named ${name} already exists.`);
  }
}

export default async function * create ({ name, settings }, threadId) {
  if (games.has(name)) {
    throw new GameAlreadyExists(threadId, name);
  }
  const game = new Game(name, settings);
  games.set(name, game);
  return yield * join.call(this, { name }, threadId);
}
