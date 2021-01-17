<script>
import context from '../context';
import Board from './Board.svelte';
import FactionPicker from './FactionPicker.svelte';
import Phases from '../types/Phase';
import PlayArea from './PlayArea.svelte';

const { state } = context();

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
  width: calc(100vw - 350px);
  transform: translateX(-350px);
  transition: transform 0.2s;
  background-color: blue;

  &:hover,
  &.expanded {
    transform: translateX(-100%);
  }
}
</style>
