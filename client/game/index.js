import { accept } from '../model/Acceptor';
import Rejection from '../model/Rejection';
import { username as usernameStore, acceptor as acceptorStore } from '../store';

async function * game () {
  for (;;) {
    try {
      const { username } = yield * accept.call(this, 'IdentificationForm:identify');
      await this.send('identify', { username });
      usernameStore.set(username);
      break;
    } catch (e) {
      // TODO: prompt user for a different name
      console.error(e);
    }
  }

  for (;;) {
    try {
      const game = yield * accept.call(this,
        { type: 'CreateGameForm:create', async * handler ({ name, settings }) {
          try {
            return this.send('create', { name, settings });
          } catch (e) {
            if (e instanceof Rejection) {
              console.error(e);
              throw e;
            }
          }
        }},
        { type: 'JoinGameForm:join', async * handler ({ name }) {
          try {
            return this.send('join', { name });
          } catch (e) {
            if (e instanceof Rejection) {
              console.error(e);
              throw e;
            }
          }
        }},
      );
      console.log(game);
    } catch (e) {
      // TODO: tell user why this didn't work
      console.error(e);
    }
  }
}

export default async function (client) {
  const instance = game.call(client);
  let { done, value: acceptor } = await instance.next();
  acceptorStore.set(acceptor);
  for await (const message of client) {
    if (acceptor.accepts(message)) {
      acceptorStore.set(null);
      ({ done, value: acceptor } = await instance.next(message));
      if (done) { break; }
      acceptorStore.set(acceptor);
    }
  }
}
