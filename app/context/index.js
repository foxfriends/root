import { share, map } from 'rxjs/operators';
import { prop } from 'ramda';
import { setContext, getContext, onDestroy } from 'svelte';
import StoreSubject from './StoreSubject';
import Socket from './Socket';

export default function context() {
  return {
    state: getContext('@root/state'),
    actions: getContext('@root/actions'),
    socket: getContext('@root/socket'),
  };
}

export function init() {
  const state = new StoreSubject(null);
  const actions = new StoreSubject([]);
  const socket = new Socket();

  const messages = socket.messages().pipe(share());
  const updateState = messages.pipe(map(prop('game'))).subscribe(state);
  const updateActions = messages.pipe(map(prop('actions'))).subscribe(actions);

  setContext('@root/state', state);
  setContext('@root/actions', actions);
  setContext('@root/socket', socket);

  onDestroy(() => {
    updateState.unsubscribe();
    updateActions.unsubscribe();
  });
}
