<script>
import Box from './component/Box.svelte';
import Message from '../model/Message';

let name = '';
export let client;

function submit() {
  client.notify(Message.direct('IdentificationForm:identify', { username: name }))
}
</script>

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
  margin: 16px 0 0 0;
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
</style>

<Box>
  <div class='flex'>
    <h1 class='heading'>Please enter your name</h1>
    <input
      class='input'
      placeholder='Name'
      bind:value={name}
      on:keypress={event => event.key === 'Enter' ? submit() : void 0} />
    <button
      class='button'
      on:click={submit}>
      Enter
    </button>
  </div>
</Box>
