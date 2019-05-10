import uuid from 'uuid/v4';

export default class Message {
  public threadId!: string;
  public type!: string;
  public data: any;

  static direct(type: string, data?: any) {
    const msg = new Message();
    msg.threadId = uuid();
    msg.type = type;
    msg.data = data;
    return msg;
  }

  constructor(rawMsg?: string) {
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
