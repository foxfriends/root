import { accept } from "server/model/Acceptor.js";
import { game as gameStore } from "../store/index.js";
import type { Settings } from "server/model/Game.js";
import Client from "server/model/Client.js";

export default async function* chooseGame(this: Client) {
  const game = yield* accept.call(
    this,
    {
      type: "CreateGameForm:create",
      async *handler({ name, settings }: { name: string; settings: Settings }) {
        return this.send("create", { name, settings });
      },
    },
    {
      type: "JoinGameForm:join",
      async *handler({ name }: { name: string }) {
        return this.send("join", { name });
      },
    },
  );
  gameStore.set(game);
  return game;
}
