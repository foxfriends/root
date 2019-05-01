import uuid from 'uuid/v4.js';
import Message from './Message.js';
import Rejection from './Rejection.js';

class Closed {}
class Timeout {}

export default class Client {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.callbacks = new Map();

    this.watchers = [];

    this.socket.addEventListener('message', ({ data }) => {
      try {
        const message = new Message(data);
        console.log(message.toString());
        if (message.type === 'reject' || message.type === 'error') {
          // notify direct response
          const [,callback] = this.callbacks.get(message.threadId) || [];
          if (callback) { callback(message.type === 'reject' ? new Rejection(message.threadId, message.data, true) : new Error(message.data)); }
          // notify watchers
          const { watchers } = this;
          this.watchers = [];
          watchers.forEach(([,reject]) => reject(message));
        } else {
          // notify direct response
          const [callback] = this.callbacks.get(message.threadId) || [];
          if (callback) { callback(message.data); }
          // notify watchers
          const { watchers } = this;
          this.watchers = [];
          watchers.forEach(([resolve]) => resolve(message));
        }
      } catch (e) {
        console.error(data, e);
      }
    });

    this.socket.addEventListener('close', () => {
      const { watchers } = this;
      this.watchers = [];
      watchers.forEach(([,reject]) => reject(new Closed));
    });

    this.socket.addEventListener('error', error => {
      const { watchers } = this;
      this.watchers = [];
      watchers.forEach(([,reject]) => reject(error));
    });
  }

  send(type, data, timeout = 10000) {
    const threadId = uuid();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.callbacks.delete(threadId);
        reject(new Timeout);
      }, timeout);
      this.callbacks.set(threadId, [
        value => { this.callbacks.delete(threadId); clearTimeout(timer); resolve(value); },
        error => { this.callbacks.delete(threadId); clearTimeout(timer); reject(error); },
      ]);
      this.socket.send(JSON.stringify({
        threadId,
        type,
        data,
      }));
    });
  }

  respond(threadId, type, data) {
    this.socket.send(JSON.stringify({
      threadId,
      type: type || 'response',
      data,
    }));
  }

  reject(threadId, reason) {
    this.socket.send(JSON.stringify({
      threadId,
      type: 'reject',
      data: reason,
    }));
  }

  throw(error) {
    const { watchers } = this;
    this.watchers = [];
    watchers.forEach(([,reject]) => reject(error));
  }

  notify(message) {
    const { watchers } = this;
    this.watchers = [];
    watchers.forEach(([resolve]) => resolve(message));
  }

  async * [Symbol.asyncIterator] () {
    for (;;) {
      try {
        yield new Promise((resolve, reject) => this.watchers.push([resolve, reject]));
      } catch (e) {
        console.log('here', e);
        if (e instanceof Closed) {
          break;
        } else {
          throw e;
        }
      }
    }
  }
}
