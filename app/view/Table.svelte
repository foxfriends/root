<script>
  import { propEq } from 'ramda';
  import context from '../context';
  import Button from './component/Button.svelte';
  import Text from './component/Text.svelte';
  import Board from './Board.svelte';
  import FactionPicker from './FactionPicker.svelte';
  import EyrieLeaderPicker from './EyrieLeaderPicker.svelte';
  import VagabondPicker from './VagabondPicker.svelte';
  import PlayerHud from './PlayerHud.svelte';
  import PlayerArea from './PlayerArea.svelte';
  import Phases from '../types/Phase';
  import { match } from '../util/lumber';

  const { state, socket, actions } = context();

  $: expanded = false; // why would this expand?
  $: currentFaction = $state.factions
    .find(propEq('player', socket.name))
    .faction;

  function show(faction) {
    expanded = true;
    currentFaction = faction;
  }

  function close() {
    expanded = false;
  }

  function keydown({ key }) {
    if (key === 'Escape') {
      expanded = false;
    } else {
      const i = parseInt(key);
      if (!Number.isNaN(i) && $state.factions[i - 1]) {
        expanded = true;
        currentFaction = $state.factions[i - 1].faction;
      }
    }
  }
</script>

<div class='table'>
  <Board />
</div>

<div class='hud'>
  {#each $state.factions as faction}
    <div class='player' on:click={() => show(faction.faction)}>
      <PlayerHud {faction} />
    </div>
  {/each}
</div>

<div class='play-area' class:expanded>
  {#each $state.factions as faction, i (faction.faction)}
    <div
      class='player-area {faction.faction}'
      class:left={i < $state.factions.findIndex(propEq('faction', currentFaction))}
      class:right={i > $state.factions.findIndex(propEq('faction', currentFaction))}>
      <PlayerArea {faction} />
    </div>
  {/each}
  <div class='closer'>
    <Button
      on:click={close}>
      <Text text='back' />
    </Button>
  </div>
</div>

{#if $state.phase === Phases.CHOOSE_FACTION}
  <FactionPicker />
{/if}

{#if $actions.filter(match('eyrie_choose_leader(A)')).length}
  <EyrieLeaderPicker />
{/if}

{#if $actions.filter(match('vagabond_choose_character(A)')).length}
  <VagabondPicker />
{/if}

<svelte:window on:keydown={keydown} />

<style>
  .table {
    position: absolute;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: #3C4E42;
  }

  .hud {
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: flex-end;
    padding: 0 64px;
    gap: 64px;
    flex-wrap: no-wrap;
    pointer-events: none;

    & .player {
      box-sizing: border-box;
      flex-basis: calc((100vw - 64px * 5) / 4);
      flex-shrink: 1;
      min-width: 0;
      pointer-events: auto;
      cursor: pointer;

      border: 55px solid transparent;
      border-bottom: 0px solid;
      border-image-source: url('./image/box.png');
      border-image-slice: 55 fill;
      border-image-width: 55px 55px 0 55px;
      border-image-repeat: round;
    }
  }

  .play-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transform: translateY(100%);
    transition: transform 0.2s;

    &.expanded {
      transform: translateY(0);
    }
  }

  .player-area {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--color--background);

    transition: transform 0.2s;
    &.left { transform: translateX(-100%); }
    &.right { transform: translateX(100%); }

    /*
    background-size: 20%;
    &.marquise { background-image: url('./image/pattern/pattern-marquise.jpg'); }
    &.eyrie { background-image: url('./image/pattern/pattern-eyrie.jpg'); }
    &.alliance { background-image: url('./image/pattern/pattern-alliance.jpg'); }
    &.vagabond { background-image: url('./image/pattern/pattern-vagabond.jpg'); }
    */
  }

  .closer {
    position: absolute;
    top: 16px;
    right: 16px;
  }
</style>
