import { setRejectionHandler } from '../model/Acceptor';
import identify from './identify';
import chooseGame from './chooseGame';
import lobby, { Leave } from './lobby';
import start from './start';
import {
  acceptor as acceptorStore,
  game as gameStore,
  rejection as rejectionStore,
} from '../store';

async function * game () {
  yield * identify.call(this);
  for (;;) {
    try {
      const game = yield * chooseGame.call(this);
      if (game.turn === null) {
        yield * lobby.call(this);
      } else {
        yield * start.call(this);
      }
    } catch (e) {
      if (e instanceof Leave) {
        gameStore.set(null);
        continue;
      }
      throw e;
    }
  }
}

setRejectionHandler(rejection => {
  rejectionStore.set(rejection);
});

export default async function (client) {
  const instance = game.call(client);
  let { done, value: acceptor } = await instance.next();
  acceptorStore.set(acceptor);
  for await (const message of client) {
    if (message.type === 'update') {
      gameStore.set(message.data);
    }
    if (acceptor.accepts(message)) {
      rejectionStore.set(null);
      acceptorStore.set(null);
      ({ done, value: acceptor } = await instance.next(message));
      if (done) { break; }
      acceptorStore.set(acceptor);
    }
  }
}
