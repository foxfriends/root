<script>
import Box from './component/Box.svelte';
import Text from './component/Text.svelte';
import Message from '../model/Message';
import { game } from '../store';

export let client;

let ready = false;
$: {
  if (ready) {
    client.notify(Message.direct('Lobby:ready'));
  } else {
    client.notify(Message.direct('Lobby:unready'));
  }
}

function leave() {
  client.notify(Message.direct('Lobby:leave'));
}
</script>

<Box>
  <div class='flex'>
    <button
      class='button back'
      on:click={leave}>
      <Text text='leave' />
    </button>
    <button
      class='button'
      on:click={() => ready = !ready}>
      <Text text={ready ? 'cancel' : 'ready'} />
    </button>
  </div>
</Box>

<style>
.flex {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.input, .button {
  box-sizing: border-box;
  padding: 8px;
  border: none;
  background-color: transparent;
}

.button {
  align-self: flex-end;
  cursor: pointer;
  font-family: var(--font-family--display);
  color: var(--color--accent);
  font-size: 16px;
}

.button:hover {
  color: var(--color--accent__hover);
}

.button.back {
  align-self: flex-start;
}

.button:disabled {
  cursor: default;
  color: var(--color--text);
  opacity: 0.6;
}
</style>
