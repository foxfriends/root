import { get, type Readable } from "svelte/store";

export default function borrow<T>(
  store: Readable<T>,
): <U>(handler: (value: T) => U) => U {
  return (handler) => handler(get(store));
}
