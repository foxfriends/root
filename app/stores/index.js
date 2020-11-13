import { setContext, getContext } from 'svelte';
import { BehaviorSubject } from 'rxjs';

export default function stores() {
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

  const socket = new WebSocket(`ws://${window.location.host}/game`);
  setContext('@root/state', state);
  setContext('@root/socket', socket);
}
