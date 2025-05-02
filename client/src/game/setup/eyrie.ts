import { get } from "svelte/store";
import { game, prompts } from "../../store/index.js";
import { accept } from "server/model/Acceptor.js";
import locate from "../../util/locate.js";
import Leader from "server/model/Leader.js";
import Piece from "server/model/Piece.js";
import Leaders from "server/model/Leader.js";
import Client from "server/model/Client.js";
import Clearing from "server/model/board/Clearing.js";

export default async function* setupEyrie(this: Client) {
  if (!get(game)!.factionData.eyrie!.leader) {
    const availableLeaders = get(game)!.factionData.eyrie!.leaders;
    prompts.set({
      text: "prompt-choose-leader",
      cards: Object.values(Leaders).map((leader) =>
        availableLeaders.includes(leader)
          ? {
              value: leader,
              image: `/image/card/card-eyrie_leader-front.${leader}.jpg`,
            }
          : {
              available: false,
              image: "/image/card/card-eyrie_leader-back.jpg",
            },
      ),
    });
    game.set(
      yield* accept.call(this, {
        type: "Prompts:card",
        async *handler({ value }: { value: Leader }) {
          return this.send("chooseLeader", { leader: value });
        },
      }),
    );
  }
  const keepClearing = locate.call(get(game)!.board, Piece.marquise.keep);
  if (!keepClearing) {
    prompts.set({
      text: "prompt-choose-starting-clearing",
      clearings: get(game)!.board.clearings.filter(
        (clearing) => clearing.isCorner,
      ),
    });
    game.set(
      yield* accept.call(this, {
        type: "Prompts:clearing",
        async *handler({ clearing }: { clearing: Clearing }) {
          return this.send("eyrieClearing", { clearing: clearing.index });
        },
      }),
    );
  }
  prompts.set(null);
}
