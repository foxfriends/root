import { accept } from './runtime.js';

export default async function * identify ({ username }, threadId) {
  this.username = username;
  this.respond(threadId);
}
