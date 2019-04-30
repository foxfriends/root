import uuid from 'uuid/v4.js';

export default class Message {
  static direct(type, data) {
    const msg = new Message();
    msg.threadId = uuid();
    msg.type = type;
    msg.data = data;
    return msg;
  }

  constructor(rawMsg) {
    if (rawMsg) {
      const { threadId, type, data } = JSON.parse(rawMsg);
      this.threadId = threadId;
      this.type = type;
      this.data = data;
    }
  }

  toString() {
    return `${this.type} (${this.threadId}): ${JSON.stringify(this.data)}`
  }
}
