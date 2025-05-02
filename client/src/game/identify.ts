import { accept } from "server/model/Acceptor.js";
import { username as usernameStore } from "../store";
import Client from "server/model/Client.js";

export default async function* identify(this: Client) {
  yield* accept.call(this, {
    type: "IdentificationForm:identify",
    async *handler({
      username,
    }: {
      username: string;
    }): AsyncIterableIterator<void> {
      await this.send("identify", { username });
      usernameStore.set(username);
    },
  });
}
