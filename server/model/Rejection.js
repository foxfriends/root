export default class Rejection {
  constructor(threadId, message, remote = false) {
    this.threadId = threadId;
    this.message = message;
    this.remote = remote;
  }
}
