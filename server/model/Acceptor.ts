import Rejection from './Rejection';
import Message from './Message';
import Client from './Client';

export class Abort {
  constructor() {}
}

class Unacceptable extends Error {
  constructor(type: string) {
    super(`Cannot accept message of type ${type}`);
  }
}

type Handler = string | ((data: any, threadId: string) => any) | { type: string, handler: (data: any, threadId: string) => any }

const matches = ({ type }: Message) => (handler: Handler) => {
  if (typeof handler === 'string') {
    return handler === type;
  } else if (typeof handler === 'function') {
    return handler.name === type;
  } else if (typeof handler === 'object') {
    return handler.type === type;
  }
  throw new Error('Invalid handler');
}

export class Acceptor {
  constructor(
    public spec: Handler[],
  ) {}

  accepts(msg: Message) {
    return this.spec.some(matches(msg));
  }

  async * accept(thisarg: Client, msg: Message) {
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
    throw new Unacceptable(msg.type);
  }

  description() {
    const description = [];
    for (const handler of this.spec) {
      if (typeof handler === 'string') {
        description.push(`${handler}`);
      } else if (typeof handler === 'function') {
        description.push(`${handler.name}`);
      } else if (typeof handler === 'object') {
        description.push(`${handler.type}`);
      }
    }
    return description.join(', ');
  }
}

let rejectionHandler = (rejection: any) => console.error(rejection);
export function setRejectionHandler(handler: (rejection: any) => void) {
  rejectionHandler = handler || (rejection => console.error(rejection));
}

export async function * accept (this: Client, ...spec: Handler[]) {
  const acceptor = new Acceptor(spec);
  for (;;) {
    try {
      return await (yield * acceptor.accept(this, yield acceptor));
    } catch (e) {
      if (e instanceof Rejection) {
        if (e.remote) {
          console.warn('Rejected:', e)
          // remote rejections need to be reported to the user
          rejectionHandler(e);
        } else {
          console.log('Rejecting:', e)
          // local rejections need to be reported to the remote
          this.reject(e.threadId, e.message);
        }
        continue;
      }
      throw e;
    }
  }
}
