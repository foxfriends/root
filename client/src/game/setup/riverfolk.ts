import { get } from "svelte/store";
import borrow from "../../util/borrow.js";
import { game, prompts } from "../../store/index.js";
import { accept } from "server/model/Acceptor.js";
import Client from "server/model/Client.js";
import Clearing from "server/model/board/Clearing.js";
import type { ServiceCosts } from "server/model/factionData/Riverfolk.js";

export default async function* setupRiverfolk(this: Client) {
  borrow(game)((game) => {
    const riverClearings = new Set(
      ([] as number[]).concat(...game!.board.rivers),
    );
    prompts.set({
      text: "prompt-choose-rivers",
      clearings: [...riverClearings].map(
        (index) => game!.board.clearings[index],
      ),
    });
  });
  while (get(game)!.factionData.riverfolk!.warrior > 11) {
    game.set(
      yield* accept.call(this, {
        type: "Prompts:clearing",
        async *handler({
          clearing,
        }: {
          clearing: Clearing;
        }): AsyncIterableIterator<void> {
          return this.send("placeWarrior", { clearing: clearing.index });
        },
      }),
    );
  }
  prompts.set({
    text: "prompt-set-prices",
    prices: true,
  });
  game.set(
    yield* accept.call(this, {
      type: "Prompts:prices",
      async *handler(prices: ServiceCosts): AsyncIterableIterator<void> {
        return this.send("setPrices", prices);
      },
    }),
  );
  prompts.set(null);
}
