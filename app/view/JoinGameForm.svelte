<script>
import { createEventDispatcher } from 'svelte';
import Box from './component/Box.svelte';
import Button from './component/Button.svelte';
import Text from './component/Text.svelte';
import { key } from '../util/event';

let name = '';

const dispatch = createEventDispatcher();
const back = () => dispatch('back');
const next = () => name && dispatch('next', name);
</script>

<Box>
  <Button on:click={back}>
    <Text text='back' />
  </Button>
  <h1 class='heading'>
    <Text text='game-name' />
  </h1>
  <!-- TODO [l10n]: the placeholder is not localized -->
  <label>
    <input
      class='input'
      placeholder='Name'
      bind:value={name}
      on:keypress={key('Enter', next)}>
  </label>
  <Button disabled={!name} on:click={next}>
    <Text text='join' />
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
