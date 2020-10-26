import { setContext, getContext } from 'svelte';
import { BehaviorSubject } from 'rxjs';

export default function stores() {
  return {
    state: getContext('@root/state'),
  };
}

export function init() {
  const state = new BehaviorSubject({
    user: {},
    lobby: {},
    game: {},
  });
  setContext('@root/state', state);
}
