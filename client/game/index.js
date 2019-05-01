import { setRejectionHandler, accept } from '../model/Acceptor';
import Rejection from '../model/Rejection';
import identify from './identify';
import chooseGame from './chooseGame';
import lobby, { Leave } from './lobby';
import {
  acceptor as acceptorStore,
  game as gameStore,
  rejection as rejectionStore,
  screen,
} from '../store';

async function * game () {
  yield * identify.call(this);
  for (;;) {
    try {
      const game = yield * chooseGame.call(this);
      yield * lobby.call(this, { game });
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
  console.log(rejection);
  rejectionStore.set(rejection);
});

export default async function (client) {
  const instance = game.call(client);
  let { done, value: acceptor } = await instance.next();
  acceptorStore.set(acceptor);
  for await (const message of client) {
    if (acceptor.accepts(message)) {
      rejectionStore.set(null);
      acceptorStore.set(null);
      ({ done, value: acceptor } = await instance.next(message));
      if (done) { break; }
      acceptorStore.set(acceptor);
    }
  }
}
