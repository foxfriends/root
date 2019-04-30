import uuid from 'uuid/v4';
import App from './App.svelte';
import Client from './model/Client';
import game from './game';

const socket = new WebSocket(`ws://${window.location.host}/play`);
const app = new App({ target: document.body });

socket.onopen = async () => {
  const client = new Client(uuid(), socket);
  app.$set({ client });
  await game(client);
}
