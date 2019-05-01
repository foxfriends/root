import { writable } from 'svelte/store';

export const acceptor = writable(null);
export const screen = writable('cover');
export const username = writable(null);
export const game = writable(null);
export const errorMessage = writable(null);
