import { setRejectionHandler, accept } from '../model/Acceptor';
import Rejection from '../model/Rejection';
import { username as usernameStore, acceptor as acceptorStore, game as gameStore, screen, errorMessage } from '../store';

async function * game () {
  const username = yield * accept.call(this,
    { type: 'IdentificationForm:identify', async * handler ({ username }) {
      await this.send('identify', { username });
      usernameStore.set(username);
      return username;
    }},
  );

  const game = yield * accept.call(this,
    { type: 'CreateGameForm:create', async * handler ({ name, settings }) {
      return this.send('create', { name, settings });
    }},
    { type: 'JoinGameForm:join', async * handler ({ name }) {
      return this.send('join', { name });
    }},
  );
  gameStore.set(game);

  screen.set('play');
}

setRejectionHandler(({ message }) => {
  errorMessage.set(message);
});

export default async function (client) {
  const instance = game.call(client);
  let { done, value: acceptor } = await instance.next();
  acceptorStore.set(acceptor);
  for await (const message of client) {
    if (acceptor.accepts(message)) {
      errorMessage.set(null);
      acceptorStore.set(null);
      ({ done, value: acceptor } = await instance.next(message));
      if (done) { break; }
      acceptorStore.set(acceptor);
    }
  }
}
