import { get, Store } from 'svelte/store';

export default function borrow <T, U> (store: Store<T>): (handler: (value: T) => U) => U {
  return handler => handler(get(store));
}
