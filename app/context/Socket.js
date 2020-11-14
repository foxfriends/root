import { fromEvent } from 'rxjs';
import { filter, first, map, share, tap } from 'rxjs/operators';
import { prop, propEq, cond } from 'ramda';
import * as uuid from 'uuid';

export class CommandError extends Error {
  constructor({ code, message }) {
    super(message);
    this.name = 'CommandError';
    this.code = code;
  }
}

export default class Socket extends WebSocket {
  #onerror;
  #connected;

  constructor() {
    super(`ws://${window.location.host}/game`);
    this.#onerror = fromEvent(this, 'error')
      .subscribe((error) => console.error(error));
    this.name = name;
    this.#connected = fromEvent(this, 'open').pipe(first()).toPromise();
  }

  setName(name) {
    return this.request({ setName: name });
  }

  joinGame(name) {
    return this.request({ joinGame: name });
  }

  createGame(config) {
    return this.request({ createGame: config });
  }

  perform(action) {
    return this.request(action);
  }

  async request(message) {
    await this.#connected;
    const id = uuid.v4();
    const response = this
      .messages()
      .pipe(
        filter(propEq('id', id)),
        tap((response) => console.log(`Received response ${id}`, response)),
        map(cond([
          [propEq('status', 'Err'), ({ error }) => throw new CommandError(error)],
          [propEq('status', 'Ok'), prop('data')],
        ])),
        first(),
      )
      .toPromise();
    console.log(`Sending message ${id}`, message);
    this.send(JSON.stringify({ id, msg: message }));
    return response;
  }

  messages() {
    return fromEvent(this, 'message').pipe(
      map(prop('data')),
      map(JSON.parse),
    );
  }

  close() {
    this.#onerror.unsubscribe();
    super.close();
  }
}
