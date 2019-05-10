import games from '../../store/games';
import Rejection from '../../model/Rejection';
import Client from '../../model/Client';
import { accept } from '../../model/Acceptor';
import ready from './ready';
import unready from './unready';
import leave from './leave';
import start from '../play/start';

class GameDoesNotExist extends Rejection {
  constructor(threadId: string, name: string) {
    super(threadId, {
      key: 'rejection-game-does-not-exist',
      params: { name },
    });
  }
}

export default async function * join (this: Client, { name }: { name: string }, threadId: string) {
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
      console.log(`${this.username}: ${game.allReady}`);
      yield * accept.call(this, leave, ready, unready, 'gameUpdated');
      this.send('update', game);
    }
    this.send('start');
  }
  // start the game
  yield * start.call(this);
}
