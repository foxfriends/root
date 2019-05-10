import games from '../../store/games';
import join from './join';
import Rejection from '../../model/Rejection';
import Game, { Settings } from '../../model/Game';
import Client from '../../model/Client';

class GameAlreadyExists extends Rejection {
  constructor(threadId: string, name: string) {
    super(threadId, {
      key: 'rejection-game-already-exists',
      params: { name },
    });
  }
}

export default async function * create (this: Client, { name, settings }: { name: string, settings: Settings }, threadId: string) {
  if (games.has(name)) {
    throw new GameAlreadyExists(threadId, name);
  }
  const game = new Game(name, settings);
  games.set(name, game);
  return yield * join.call(this, { name }, threadId);
}
