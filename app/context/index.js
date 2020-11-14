import { setContext, getContext } from 'svelte';
import { BehaviorSubject } from 'rxjs';
import Socket from './Socket';

export default function context() {
  return {
    state: getContext('@root/state'),
    socket: getContext('@root/socket'),
  };
}

export function init() {
  const state = new BehaviorSubject({
    user: {},
    lobby: {},
    game: {},
  });

  const socket = new Socket();
  setContext('@root/state', state);
  setContext('@root/socket', socket);
}
