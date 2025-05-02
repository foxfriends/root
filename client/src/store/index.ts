import { writable, derived, type Writable } from "svelte/store";
import loc from "../localization/index.js";
import Rejection from "server/model/Rejection.js";
import Game from "server/model/Game.js";
import type { Prompts } from "../model/Prompts.js";
import { Acceptor } from "server/model/Acceptor.js";

export const acceptor: Writable<Acceptor | null> = writable(null);
export const screen: Writable<"cover" | "board"> = writable(<"cover">"cover");
export const username: Writable<string | null> = writable(null);
export const game: Writable<Game | null> = writable(null);
export const prompts: Writable<Prompts | null> = writable(null);
export const rejection: Writable<Rejection | null> = writable(null);
export const errorMessage = derived(
  rejection,
  async (rejection: Rejection | null, set: (value: string | null) => void) => {
    if (!rejection) {
      set(null);
    } else {
      set(await rejection.localizedMessage(loc));
    }
  },
  null,
);
