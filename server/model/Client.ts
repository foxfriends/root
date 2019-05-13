import uuid from 'uuid/v4';
import Message from './Message';
import Rejection from './Rejection';
import Game from './Game';

class Closed {}
class Timeout {}

type Callback = (msg: any) => void;
type ErrorCallback = (error: Error | Rejection | Timeout) => void;
type Callbacks = [Callback, ErrorCallback];
type OptionalCallbacks = [Callback?, ErrorCallback?];

export default class Client {
  id: string;
  socket: any;
  callbacks: Map<String, Callbacks>;
  receivedMessages: Message[];
  watchers: Callbacks[];
  // these are technically nullable, but *should* be set for any useful part of the game
  username!: string;
  game!: Game;

  constructor(id: string, socket: WebSocket) {
    this.id = id;
    this.socket = socket;
    this.callbacks = new Map();
    this.receivedMessages = [];

    this.watchers = [];

    this.socket.addEventListener('message', ({ data }: { data: any }) => {
      try {
        const message = new Message(data);
        if (message.type === 'reject' || message.type === 'error') {
          // notify direct response
          const error = message.type === 'reject' ? new Rejection(message.threadId, message.data, true) : new Error(message.data);
          const [,callback]: OptionalCallbacks = this.callbacks.get(message.threadId) || [];
          if (callback) {
            console.log(`Response received (${message.threadId}): ${message.type}`);
            callback(error);
          } else {
            // notify watchers
            this.throw(error);
          }
        } else {
          // notify direct response
          const [callback]: OptionalCallbacks = this.callbacks.get(message.threadId) || [];
          if (callback) {
            console.log(`Response received (${message.threadId}): ${message.type}`);
            callback(message.data);
          } else {
            // notify watchers
            this.notify(message);
          }
        }
      } catch (e) {
        console.error(data, e);
      }
    });

    this.socket.addEventListener('close', () => this.throw(new Closed));

    this.socket.addEventListener('error', (error: Error) => this.throw(error));
  }

  send(type: string, data?: any, timeout: number = 10000) {
    const threadId = uuid();
    let callbacks: Callbacks;
    let timer: NodeJS.Timeout;
    const promise = new Promise((resolve, reject) => {
      callbacks = [
        value => { this.callbacks.delete(threadId); clearTimeout(timer); resolve(value); },
        error => { this.callbacks.delete(threadId); clearTimeout(timer); reject(error); },
      ];
      this.socket.send(JSON.stringify({
        threadId,
        type,
        data,
      }));
    });
    return {
      // don't care about these args, just pass to .then
      then: async (...args: any[]) => {
        timer = setTimeout(() => {
          const [, reject] = this.callbacks.get(threadId)!;
          this.callbacks.delete(threadId);
          reject(new Timeout);
        }, timeout);
        this.callbacks.set(threadId, callbacks);
        return promise.then(...args);
      }
    };
  }

  respond(threadId: string, type?: string, data?: any) {
    console.log(`Responding (${threadId}): ${type}`);
    this.socket.send(JSON.stringify({
      threadId,
      type: type || 'response',
      data,
    }));
  }

  reject(threadId: string, reason: any) {
    this.socket.send(JSON.stringify({
      threadId,
      type: 'reject',
      data: reason,
    }));
  }

  throw(error: Error | Rejection | Timeout) {
    const { watchers } = this;
    this.watchers = [];
    watchers.forEach(([,reject]) => reject(error));
  }

  notify(message: Message) {
    console.log(`${this.username}: ${message.toString()}`);
    const { watchers } = this;
    if (this.watchers.length && !this.receivedMessages.length) {
      this.watchers = [];
      watchers.forEach(([resolve]) => resolve(message));
    } else {
      this.receivedMessages.push(message);
    }
  }

  async * [Symbol.asyncIterator] () {
    for (;;) {
      try {
        if (this.receivedMessages.length) {
          const [first, ...rest] = this.receivedMessages;
          this.receivedMessages = rest;
          yield first;
        } else {
          yield await new Promise((resolve, reject) => this.watchers.push([resolve, reject]));
        }
      } catch (e) {
        console.error(e);
        if (e instanceof Closed) {
          break;
        } else {
          throw e;
        }
      }
    }
  }
}
