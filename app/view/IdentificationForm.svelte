<script>
import { thunkify } from 'ramda';
import { createEventDispatcher } from 'svelte';
import Box from './component/Box.svelte';
import Button from './component/Button.svelte';
import Text from './component/Text.svelte';
import { key } from '../util/event';

const dispatch = thunkify(createEventDispatcher());

let name = '';
</script>

<Box flex>
  <h1 class='heading'>
    <Text text='please-enter-your-name' />
  </h1>
  <label>
    <input
      class='input'
      placeholder='Name'
      bind:value={name}
      on:keypress={key('Enter', name ? dispatch('next', name) : () => {})} />
  </label>
  <Button disabled={!name} on:click={dispatch('next', name)}>
    <Text text='enter' />
  </Button>
</Box>

<style>
.heading {
  font-family: var(--font-family--display);
  font-size: 20px;
  font-weight: 400;
}

.input {
  box-sizing: border-box;
  padding: 8px;
  border: none;
  background-color: transparent;
  width: 100%;
  border-bottom: 1px solid var(--color--accent);
  font-family: var(--font-family--body);
  font-size: 16px;
}
</style>
