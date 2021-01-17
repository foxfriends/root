<script>
import { complement, equals, identity, prop } from 'ramda';
import { map, filter, first } from 'rxjs/operators';
import { createEventDispatcher, onMount } from 'svelte';
import context from '../context';
import Action from './component/Action.svelte';
import Box from './component/Box.svelte';
import Button from './component/Button.svelte';
import Text from './component/Text.svelte';
import Phase from '../types/Phase';

const dispatch = createEventDispatcher();
const next = () => dispatch('next');
const back = () => dispatch('back');
const { state } = context();

onMount(() => state
  .pipe(
    filter(identity),
    map(prop('phase')),
    first(complement(equals(Phase.LOBBY))),
  )
  .subscribe(next));
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
        <div><Text text={faction.faction} params={{ form: 'long' }} /></div>
      {/each}
    </fieldset>
    <fieldset>
      <legend><Text text='players' /></legend>
      {#each $state.players as player (player.name)}
        <div>{player.name}: {player.ready ? 'Ready' : 'Waiting'}</div>
      {/each}
    </fieldset>
  </div>
  <div class='actions'>
    <Action action='lobby(ready)' let:perform>
      <Button on:click={perform}>
        <Text text='ready' />
      </Button>
    </Action>
    <Action action='lobby(unready)' let:perform>
      <Button on:click={perform}>
        <Text text='cancel' />
      </Button>
    </Action>
    <Action action='lobby(start)' let:perform>
      <Button on:click={perform}>
        <Text text='start' />
      </Button>
    </Action>
  </div>
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
