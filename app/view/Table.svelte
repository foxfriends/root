<script>
import Board from './Board.svelte';
// import PlayArea from './PlayArea.svelte';

let windowWidth, windowHeight;
$: boardHeight = windowHeight;
$: boardWidth = windowWidth - 350;

$: expanded = false; // why would this expand?
</script>

<div class='table'>
  <div class='board' style='width: {boardWidth}px'>
    <Board tableWidth={boardWidth} tableHeight={boardHeight} />
  </div>
  <div class='play-area' class:expanded>
    <!-- PlayArea tableWidth={boardWidth} tableHeight={boardHeight} {client} /-->
  </div>
</div>

<svelte:window
  bind:innerWidth={windowWidth}
  bind:innerHeight={windowHeight} />

<style>
.table {
  position: relative;
  width: 100%;
  height: 100%;
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
  background-color: blue;
}

.play-area:hover,
.play-area.expanded {
  transform: translateX(-100%);
}
</style>
