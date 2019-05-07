import { get } from 'svelte/store';

export default function borrow (store) {
  return handler => handler(get(store));
}
