import { race, fromEvent } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';
import { compose, hasIn, not, prop, propEq, when } from 'ramda';
import * as uuid from 'uuid';
import { l } from '../util/localization';
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
        const warning = toast(await l`toast-reconnecting`(), false);
        await this.#connect();
        warning.dismiss();
      });
    this.#onerror = fromEvent(this.#socket, 'error').subscribe((error) => console.error(error));
    if (this.name) { await this.setName(this.name); }
    if (this.room) { await this.joinGame(this.room); } // TODO: handle the returned game state
  }

  async setName(name) {
    await this.request({ setName: name });
    this.name = name;
  }

  async joinGame(name) {
    await this.request({ joinGame: name });
    this.room = name;
  }

  async leaveGame() {
    await this.request({ leaveGame: {} });
    this.room = undefined;
  }

  async createGame(config) {
    await this.request({ createGame: config });
    this.room = config.name;
  }

  perform(action) {
    return this.request({ perform: action });
  }

  async request(message) {
    await this.#connected;
    const id = uuid.v4();
    const response = fromEvent(this.#socket, 'message')
      .pipe(
        map(prop('data')),
        map(JSON.parse),
        first(propEq('id', id)),
        tap((response) => console.log(`Received response ${id}`, response)),
        map(when(propEq('status', 'err'), ({ error }) => throw new CommandError(error))),
      )
      .toPromise();
    console.log(`Sending message ${id}`, message);
    this.#socket.send(JSON.stringify({ id, msg: message }));
    return response;
  }

  messages() {
    return fromEvent(this.#socket, 'message').pipe(
      map(prop('data')),
      map(JSON.parse),
      filter(compose(not, hasIn('id'))),
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
