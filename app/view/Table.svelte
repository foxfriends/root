<script>
  import context from '../context';
  import Board from './Board.svelte';
  import FactionPicker from './FactionPicker.svelte';
  import EyrieLeaderPicker from './EyrieLeaderPicker.svelte';
  import VagabondPicker from './VagabondPicker.svelte';
  import Phases from '../types/Phase';
  import PlayArea from './PlayArea.svelte';
  import { match } from '../util/lumber';

  const { state, actions } = context();

  $: expanded = false; // why would this expand?
</script>

<div class='table'>
  <div class='board'>
    <Board />
  </div>
  {#if $state.phase !== Phases.CHOOSE_FACTION}
    <div class='play-area' class:expanded>
      <PlayArea />
    </div>
  {/if}
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

<style>
.table {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.board {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 350px;
}

.play-area {
  position: absolute;
  left: 100%;
  top: 0;
  bottom: 0;
  z-index: 1;
  width: calc(100% - 350px);
  transform: translateX(-350px);
  transition: transform 0.2s;
  background-color: #3c4e42;
  background-size: 20%;

  &.marquise {
    background-image: url('./image/pattern/pattern-marquise.jpg');
  }

  &.eyrie {
    background-image: url('./image/pattern/pattern-eyrie.jpg');
  }

  &.alliance {
    background-image: url('./image/pattern/pattern-alliance.jpg');
  }

  &.vagabond {
    background-image: url('./image/pattern/pattern-vagabond.jpg');
  }

  &:hover,
  &.expanded {
    transform: translateX(-100%);
  }
}
</style>
