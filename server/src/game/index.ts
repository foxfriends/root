import { accept } from "../model/Acceptor.js";
import identify from "./identify.js";
import create from "./game/create.js";
import join from "./game/join.js";
import { Leave } from "./game/leave.js";
import Client from "../model/Client.js";

async function* game(this: Client) {
  yield* accept.call(this, identify);
  for (;;) {
    try {
      yield* accept.call(this, create, join);
    } catch (e) {
      if (e instanceof Leave) {
        continue;
      }
      throw e;
    }
  }
}

export default async function (client: Client) {
  const instance = game.call(client);
  let { done, value: acceptor } = await instance.next();
  for await (const message of client) {
    if (acceptor.accepts(message)) {
      ({ done, value: acceptor } = await instance.next(message));
      if (done) {
        break;
      }
    }
  }
}
