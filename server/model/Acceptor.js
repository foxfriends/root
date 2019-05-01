import Rejection from './Rejection.js';

export class Abort {
  constructor() {}
}

class Unacceptable extends Error {
  constructor(type) {
    super(`Cannot accept message of type ${type}`);
  }
}

const matches = ({ threadId, type }) => handler => {
  if (typeof handler === 'string') {
    return handler === type;
  } else if (typeof handler === 'function') {
    return handler.name === type;
  } else if (typeof handler === 'object') {
    return (
      handler.type === type
      && (!handler.threadId || handler.threadId === threadId)
    )
  }
  throw new Error('Invalid handler');
}

class Acceptor {
  constructor(spec) {
    this.spec = spec;
  }

  accepts(msg) {
    return this.spec.some(matches(msg));
  }

  async * accept(thisarg, msg) {
    for (const handler of this.spec) {
      if (matches(msg)(handler)) {
        if (typeof handler === 'string') {
          return msg.data;
        } else if (typeof handler === 'function') {
          return yield * handler.call(thisarg, msg.data, msg.threadId);
        } else if (typeof handler === 'object') {
          return yield * handler.handler.call(thisarg, msg.data, msg.threadId)
        }
      }
    }
    throw new Unacceptable(type);
  }

  description() {
    const description = [];
    for (const handler of this.spec) {
      if (typeof handler === 'string') {
        description.push(`${handler}\n`);
      } else if (typeof handler === 'function') {
        description.push(`${handler.name}\n`);
      } else if (typeof handler === 'object') {
        description.push(`${handler.type}(${handler.threadId})\n`);
      }
    }
    return description;
  }
}

let rejectionHandler = rejection => console.error(rejection);
export function setRejectionHandler(handler) {
  rejectionHandler = handler || (rejection => console.error(rejection));
}

export async function * accept (...spec) {
  const acceptor = new Acceptor(spec);
  for (;;) {
    try {
      return yield * acceptor.accept(this, yield acceptor);
    } catch (e) {
      if (e instanceof Error) {
        // errors pass on
        throw e;
      }
      if (e instanceof Abort) {
        // events marked as abort should abort this acceptance
        throw e;
      }
      if (e instanceof Rejection) {
        if (e.remote) {
          // remote rejections need to be reported to the user
          rejectionHandler(e);
        } else {
          // local rejections need to be reported to the remote
          this.reject(e.threadId, e.message);
        }
      }
    }
  }
}
