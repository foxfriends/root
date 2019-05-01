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
    <h1 class='heading'>{$game.name}</h1>
    <fieldset>
      <legend><Text text='factions' /></legend>
      {#each $game.factions as faction}
        <div><Text text={faction} params={{ form: 'long' }} /></div>
      {/each}
    </fieldset>
    <fieldset>
      <legend><Text text='players' /></legend>
      {#each $game.playerNames as name}
        <div>{ name }: { $game.players[name].ready ? 'Ready' : 'Waiting' }</div>
      {/each}
    </fieldset>
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

.heading {
  font-family: var(--font-family--display);
  font-size: 20px;
  font-weight: 400;
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
