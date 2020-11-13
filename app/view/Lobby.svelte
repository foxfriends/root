<script>
import { createEventDispatcher } from 'svelte';
import stores from '../stores';
import Box from './component/Box.svelte';
import Button from './component/Button.svelte';
import Text from './component/Text.svelte';
import _ from '../util/lens';

const dispatch = createEventDispatcher();
const back = () => dispatch('back');
const { state } = stores();
const lobby = _.lobby(state);

let ready = false;
</script>

<Box flex>
  <Button on:click={back}>
    <Text text='leave' />
  </Button>
  <h1 class='heading'>{$lobby.name}</h1>
  <div class='horizontal'>
    <fieldset>
      <legend><Text text='factions' /></legend>
      {#each $lobby.factions as faction}
        <div><Text text={faction} params={{ form: 'long' }} /></div>
      {/each}
    </fieldset>
    <fieldset>
      <legend><Text text='players' /></legend>
      {#each $lobby.players as player (player.name)}
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
