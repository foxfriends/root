import { accept } from '../model/Acceptor';
import identify from './identify';
import create from './game/create';
import join from './game/join';
import { Leave } from './game/leave';
import Client from '../model/Client';

async function * game (this: Client) {
  yield * accept.call(this, identify);
  for (;;) {
    try {
      yield * accept.call(this, create, join);
    } catch (e) {
      if (e instanceof Leave) {
        continue;
      }
      throw e;
    }
  }
}

export default async function (client: Client) {
  const instance = game.call(client);
  let { done, value: acceptor } = await instance.next();
  console.log(acceptor.description());
  for await (const message of client) {
    if (acceptor.accepts(message)) {
      ({ done, value: acceptor } = await instance.next(message));
      console.log(acceptor.description());
      if (done) { break; }
    }
  }
}
