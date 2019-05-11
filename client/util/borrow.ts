import { get, Store } from 'svelte/store';

export default function borrow <T> (store: Store<T>): <U> (handler: (value: T) => U) => U {
  return handler => handler(get(store));
}
