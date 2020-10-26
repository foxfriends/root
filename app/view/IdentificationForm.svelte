<script>
import Box from './component/Box.svelte';
import Text from './component/Text.svelte';

let name = '';
export let client;

function submit() {
  if (name) {
    // client.notify(Message.direct('IdentificationForm:identify', { username: name }))
  }
}
</script>

<Box>
  <div class='flex'>
    <h1 class='heading'><Text text='please-enter-your-name' params={{ faction: 'marquise' }} /></h1>
    <!-- TODO [l10n]: the placeholder is not localized -->
    <input
      class='input'
      placeholder='Name'
      autofocus
      bind:value={name}
      on:keypress={event => event.key === 'Enter' && submit()} />
    <button
      class='button'
      disabled={!name}
      on:click={submit}>
      <Text text='enter' />
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

.input {
  width: 100%;
  border-bottom: 1px solid var(--color--accent);
  font-family: var(--font-family--body);
  font-size: 16px;
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

.button:disabled {
  cursor: default;
  color: var(--color--text);
  opacity: 0.6;
}
</style>
