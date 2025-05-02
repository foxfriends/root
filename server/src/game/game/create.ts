import games from "../../store/games.js";
import join from "./join.js";
import Rejection from "../../model/Rejection.js";
import Game, { Settings } from "../../model/Game.js";
import Client from "../../model/Client.js";

class GameAlreadyExists extends Rejection {
  constructor(threadId: string, name: string) {
    super(threadId, {
      key: "rejection-game-already-exists",
      params: { name },
    });
  }
}

export default async function* create(
  this: Client,
  { name, settings }: { name: string; settings: Settings },
  threadId: string,
) {
  if (games.has(name)) {
    throw new GameAlreadyExists(threadId, name);
  }
  const game = new Game(name, settings);
  games.set(name, game);
  return yield* join.call(this, { name }, threadId);
}
