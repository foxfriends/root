import { setContext, getContext } from 'svelte';
import StoreSubject from './StoreSubject';
import Socket from './Socket';

export default function context() {
  return {
    state: getContext('@root/state'),
    socket: getContext('@root/socket'),
  };
}

export function init() {
  const state = new StoreSubject(null);
  const socket = new Socket();
  setContext('@root/state', state);
  setContext('@root/socket', socket);
}
