import { get } from "svelte/store";
import borrow from "../../util/borrow.js";
import { game, prompts } from "../../store/index.js";
import { accept } from "server/model/Acceptor.js";
import Characters from "server/model/Character.js";
import Faction from "server/model/Faction.js";
import Client from "server/model/Client.js";
import ForestZone from "server/model/board/ForestZone.js";

export default async function* setupVagabond(
  this: Client,
  faction: Faction.vagabond | Faction.vagabond2,
) {
  if (!get(game)!.factionData[faction]!.character) {
    const charactersTaken = borrow(game)((game) => {
      return [
        game!.factionData.vagabond && game!.factionData.vagabond!.character,
        game!.factionData.vagabond2 && game!.factionData.vagabond2!.character,
      ];
    });
    prompts.set({
      text: "prompt-choose-character",
      cards: Object.values(Characters)
        .map((character) => character.name)
        .map((name) =>
          charactersTaken.includes(name)
            ? {
                available: false,
                image: "/image/card/card-vagabond_character-back.jpg",
              }
            : {
                value: name,
                image: `/image/card/card-vagabond_character-front.${name}.jpg`,
              },
        ),
    });
    game.set(
      yield* accept.call(this, {
        type: "Prompts:card",
        async *handler({ value }: { value: string }) {
          return this.send("chooseCharacter", { character: value });
        },
      }),
    );
  }
  prompts.set({
    text: "prompt-choose-forest",
    forests: get(game)!.board.forests,
  });
  game.set(
    yield* accept.call(this, {
      type: "Prompts:forest",
      async *handler({ forest }: { forest: ForestZone }) {
        return this.send("chooseForest", { forest: forest.index });
      },
    }),
  );
  prompts.set(null);
}
