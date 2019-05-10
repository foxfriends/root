<script>
import { game, username } from '../store';
import Board from './Board.svelte';
import PlayArea from './PlayArea.svelte';
import FactionPicker from './FactionPicker.svelte';
import TablePrompts from './TablePrompts.svelte';

let windowWidth, windowHeight;
$: boardHeight = windowHeight;
$: boardWidth = windowWidth - 350;

export let client;
let expanded = false;
</script>

<div class='table'>
  <div class='board' style={`width: ${boardWidth}px`}>
    <Board tableWidth={boardWidth} tableHeight={boardHeight} {client} />
  </div>
  <div class='play-area' class:expanded>
    <PlayArea tableWidth={boardWidth} tableHeight={boardHeight} {client} />
  </div>
  <div class='prompts'>
    <TablePrompts {client} />
  </div>
</div>
{#if $game.players[$username].faction === null}
  <FactionPicker {client} />
{/if}

<svelte:window
  bind:innerWidth={windowWidth}
  bind:innerHeight={windowHeight} />

<style>
.table {
  position: relative;
  width: 100%;
  height: 100%;
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
  background-color: blue;
}

.play-area:hover, .play-area.expanded {
  transform: translateX(-100%);
}

.prompts {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}
</style>
