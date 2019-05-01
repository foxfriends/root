<script>
import { createEventDispatcher } from 'svelte';
import Text from './component/Text.svelte';
import Message from '../model/Message';

const dispatch = createEventDispatcher();

export let client;
let name = '';

function join() {
  client.notify(Message.direct('JoinGameForm:join', { name }))
}
</script>

<button
  class='button back'
  on:click={() => dispatch('back')}>
  <Text text='back' />
</button>
<h1 class='heading'><Text text='game-name' /></h1>
<!-- TODO [l10n]: the placeholder is not localized -->
<input
  class='input'
  placeholder='Name'
  autofocus
  bind:value={name}
  on:keypress={event => event.key === 'Enter' && join()} />
<button
  class='button'
  on:click={join}>
  <Text text='join' />
</button>

<style>
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

.input {
  width: 100%;
  border-bottom: 1px solid var(--color--accent);
  font-family: var(--font-family--body);
  font-size: 16px;
}
</style>
