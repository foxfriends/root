export default class Rejection {
  constructor(threadId, message, remote = false) {
    this.threadId = threadId;
    this.message = message;
    this.remote = remote;
  }

  localizedMessage(locFn) {
    if (typeof this.message === 'string') {
      return locFn(message);
    } else {
      const { key, params } = this.message;
      return locFn(key, params);
    }
  }
}
