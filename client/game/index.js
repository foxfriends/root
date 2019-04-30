import { accept } from './runtime';

async function * game () {
  for (;;) {
    const { username } = yield * accept.call(this, 'IdentificationForm:identify');
    await this.send('identify', { username });
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
