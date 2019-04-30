import { accept } from '../model/Acceptor.js';
import identify from './identify.js';
import create from './game/create.js';
import join from './game/join.js';
import { Leave } from './game/leave.js';

async function * game () {
  yield * accept.call(this, identify);
  for (;;) {
    try {
      const game = yield * accept.call(this, create, join);
    } catch (e) {
      if (e instanceof Leave) {
        continue;
      }
      throw e;
    }
  }
}

export default async function (client) {
  const instance = game.call(client);
  let { done, value: acceptor } = await instance.next();
  for await (const message of client) {
    if (acceptor.accepts(message)) {
      ({ done, value: acceptor } = await instance.next(message));
      if (done) { break; }
    }
  }
}
