import { game as gameStore } from "../store";
import Client from "server/model/Client.js";
import Game from "server/model/Game.js";

export default async function* update(
  this: Client,
  game: Game,
): AsyncIterableIterator<void> {
  gameStore.set(game);
}
