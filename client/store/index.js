import { writable, derived } from 'svelte/store';
import loc from '../localization';

export const acceptor = writable(null);
export const screen = writable('cover');
export const username = writable(null);
export const game = writable(null);
export const rejection = writable(null);
export const errorMessage = derived(rejection, async (rejection, set) => {
  if (!rejection) {
    set(null);
  } else {
    set(await rejection.localizedMessage(loc));
  }
}, null);
