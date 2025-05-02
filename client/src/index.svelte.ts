import { v4 as uuid } from "uuid";
import { mount } from "svelte";
import App from "./App.svelte";
import Client from "server/model/Client.js";
import game from "./game/index.js";

const socket = new WebSocket(`ws://${window.location.host}/play`);

const props: { client: Client | undefined } = $state({
  client: undefined,
});
const app = mount(App, { target: document.body, props });

socket.onopen = async () => {
  props.client = new Client(uuid(), socket);
  await game(props.client);
};
