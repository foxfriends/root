declare module "svelte/store" {
  type Unsubscribe = () => void;
  type OnUnsubscribe = () => void;
  type OnSubscribe<T> = (set: (value: T) => void) => OnUnsubscribe;

  export interface Store<T> {
    subscribe(subscriber: (value: T) => void): Unsubscribe;
  }

  export interface Writable<T> extends Store<T> {
    set(value: T): void;
    update(handler: (value: T) => T): void;
  }

  export function writable<T>(value: T, onSubscribe?: OnSubscribe<T>): Writable<T>;
  export function readable<T>(value: T, onSubscribe: OnSubscribe<T>): Store<T>;

  export function derived<T, U>(store: Store<T>, callback: (value: T) => U, initialValue?: U): Store<U>;
  export function derived<T, U>(store: Store<T>, callback: (value: T, set: (value: U) => void) => any, initialValue?: U): Store<U>;
  export function derived<U>(stores: Store<any>[], callback: (values: any[]) => U, initialValue?: U): Store<U>;
  export function derived<U>(stores: Store<any>[], callback: (values: any[], set: (value: U) => void) => any, initialValue?: U): Store<U>;

  export function get<T>(store: Store<T>): T;
}
