import { race, fromEvent } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { cond, isNil, prop, propEq, propSatisfies } from 'ramda';
import * as uuid from 'uuid';
import { toast } from '../view/component/Toast.svelte';
import wait from '../util/wait';

export class CommandError extends Error {
  constructor({ code, message }) {
    super(message);
    this.name = 'CommandError';
    this.code = code;
  }
}

export default class Socket {
  #socket;
  #onerror;
  #connected;
  #disconnected;

  name;
  room;

  constructor() {
    this.#connect();
  }

  async #connect(backoff) {
    if (backoff) {
      await wait(backoff);
    }
    this.close();
    this.#socket = new WebSocket(`ws://${window.location.host}/game`);
    const open = fromEvent(this.#socket, 'open').pipe(first());
    const fail = fromEvent(this.#socket, 'error').pipe(first(), map((error) => throw error));
    try {
      this.#connected = race(open, fail).toPromise();
      await this.#connected;
    } catch (error) {
      console.error(error);
      return this.#connect(Math.min(60000, (backoff || 500) * 2));
    }
    this.#disconnected = fromEvent(this.#socket, 'close')
      .pipe(first())
      .subscribe(async () => {
        const warning = toast('Connection to the server was lost. Attempting to reconnect...', false);
        await this.#connect();
        warning.dismiss();
      });
    this.#onerror = fromEvent(this.#socket, 'error').subscribe((error) => console.error(error));
    if (this.name) { await this.setName(this.name); }
    if (this.room) { await this.joinGame(this.room); } // TODO: handle the returned game state
  }

  async setName(name) {
    const result = await this.request({ setName: name });
    this.name = name;
    return result;
  }

  async joinGame(name) {
    const result = await this.request({ joinGame: name });
    this.room = name;
    return result;
  }

  async createGame(config) {
    const result = await this.request({ createGame: config });
    this.room = config.name;
    return result;
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
          [propEq('status', 'err'), ({ error }) => throw new CommandError(error)],
          [propEq('status', 'ok'), prop('data')],
        ])),
        first(),
      )
      .toPromise();
    console.log(`Sending message ${id}`, message);
    this.#socket.send(JSON.stringify({ id, msg: message }));
    return response;
  }

  messages() {
    return fromEvent(this.#socket, 'message').pipe(
      filter(propSatisfies(isNil, 'id')),
      map(prop('data')),
      map(JSON.parse),
    );
  }

  close() {
    this.#onerror?.unsubscribe();
    this.#disconnected?.unsubscribe();
    this.#socket?.close();
    this.#onerror = null;
    this.#disconnected = null;
    this.#socket = null;
  }
}
