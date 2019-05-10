import { writable, derived, Writable } from 'svelte/store';
import loc from '../localization';
import Rejection from '../model/Rejection';
import Game from '../model/Game';
import { Prompts } from '../model/Prompts';
import { Acceptor } from '../model/Acceptor';

export const acceptor: Writable<Acceptor | null> = writable(null);
export const screen: Writable<'cover' | 'board'> = writable(<'cover'> 'cover');
export const username: Writable<string | null> = writable(null);
export const game: Writable<Game | null> = writable(null);
export const prompts: Writable<Prompts | null> = writable(null);
export const rejection: Writable<Rejection | null> = writable(null);
export const errorMessage = derived(rejection, async (rejection: Rejection | null, set: (value: string | null) => void) => {
  if (!rejection) {
    set(null);
  } else {
    set(await rejection.localizedMessage(loc));
  }
}, null);
