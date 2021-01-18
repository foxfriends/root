import { map, share } from 'rxjs/operators';
import { map as rmap, prop } from 'ramda';
import { setContext, getContext, onDestroy } from 'svelte';
import { writable } from 'svelte/store';
import StoreSubject from './StoreSubject';
import Socket from './Socket';
import { parse } from '../util/lumber';
import logger from '../util/logger';

export default function context() {
  return {
    state: getContext('@root/state'),
    actions: getContext('@root/actions'),
    socket: getContext('@root/socket'),
  };
}

export function useScale(scale) {
  if (scale !== undefined) {
    const store = writable(scale);
    setContext('@root/scale', store);
    return store;
  } else {
    return getContext('@root/scale');
  }
}

export function init() {
  const state = new StoreSubject(null);
  const actions = new StoreSubject([]);
  const socket = new Socket();

  const messages = socket.messages().pipe(share());
  const updateState = messages.pipe(map(prop('game'))).subscribe(state);
  const updateActions = messages
    .pipe(
      map(prop('actions')),
      map(rmap(parse)),
    )
    .subscribe(actions);

  const logState = state.subscribe(::logger.log);
  const logActions = actions.subscribe(::logger.log);

  setContext('@root/state', state);
  setContext('@root/actions', actions);
  setContext('@root/socket', socket);

  onDestroy(() => {
    updateState.unsubscribe();
    updateActions.unsubscribe();
    logState.unsubscribe();
    logActions.unsubscribe();
  });
}
