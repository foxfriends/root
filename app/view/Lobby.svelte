<script>
import { createEventDispatcher } from 'svelte';
import context from '../context';
import Box from './component/Box.svelte';
import Button from './component/Button.svelte';
import Text from './component/Text.svelte';

const dispatch = createEventDispatcher();
const back = () => dispatch('back');
const { state } = context();

let ready = false;
</script>

<Box flex>
  <Button on:click={back}>
    <Text text='leave' />
  </Button>
  <h1 class='heading'>{$state.name}</h1>
  <div class='horizontal'>
    <fieldset>
      <legend><Text text='factions' /></legend>
      {#each $state.factions as faction}
        <div><Text text={faction} params={{ form: 'long' }} /></div>
      {/each}
    </fieldset>
    <fieldset>
      <legend><Text text='players' /></legend>
      {#each $state.players as player (player.name)}
        <div>{player.name}: {player.ready ? 'Ready' : 'Waiting'}</div>
      {/each}
    </fieldset>
  </div>
  <Button on:click={() => ready = !ready}>
    <Text text={ready ? 'cancel' : 'ready'} />
  </Button>
</Box>

<style>
.horizontal {
  display: flex;
  align-items: flex-start;
}

.heading {
  font-family: var(--font-family--display);
  font-size: 20px;
  font-weight: 400;
}
</style>
