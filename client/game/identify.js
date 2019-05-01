import { accept } from '../model/Acceptor';
import { username as usernameStore } from '../store';

export default async function * identify () {
  yield * accept.call(this,
    { type: 'IdentificationForm:identify', async * handler ({ username }) {
      await this.send('identify', { username });
      usernameStore.set(username);
    }},
  );
}
