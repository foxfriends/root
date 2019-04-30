import games from '../../store/games.js';
import join from './join.js';
import { Rejection } from '../runtime.js';

import Game from '../../model/Game.js';

class GameAlreadyExists extends Rejection {
  constructor(name) {
    super(`A game named ${name} already exists.`);
  }
}

export default async function * create ({ name, options }) {
  if (games.has(name)) {
    throw new GameAlreadyExists(name);
  }
  const game = new Game(name, options);
  games.add(gameId, game);
  return yield * join.call(this, { name });
}
