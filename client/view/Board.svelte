<script>
import { game, username } from '../store';
import images from '../image/map-*.jpg';
import FactionPicker from './FactionPicker.svelte';

let background;
let boardWidth;
let boardHeight;
let windowWidth;
let windowHeight;

const maxScale = 0.8;
let targetScale = 0;
$: minScale = Math.max(windowWidth / boardWidth, windowHeight / boardHeight);
$: scale = Math.min(Math.max(minScale, targetScale), maxScale);

let targetPan = { x: 0, y: 0 };
$: pan = {
  x: Math.floor(Math.min(Math.max(0, targetPan.x), boardWidth * scale - windowWidth)),
  y: Math.floor(Math.min(Math.max(0, targetPan.y), boardHeight * scale - windowHeight)),
};

function setInitialViewport() {
  ({ naturalWidth: boardWidth, naturalHeight: boardHeight } = background);
}

function zoom({ deltaY }) {
  // TODO: make this smoother
  // TODO: try to keep the position under the mouse constant while zooming
  if (deltaY < 0) {
    targetScale = scale + 0.1;
  } else if (deltaY > 0) {
    targetScale = scale - 0.1;
  }
}

function drag({ buttons, movementX, movementY }) {
  if (buttons & 1) {
    targetPan = { x: pan.x - movementX, y: pan.y - movementY };
  }
}

export let client;
</script>

<div
  class='container'
  on:wheel={zoom}
  on:mousemove={drag} >
  <div
    class='viewport'
    style={`transform: translate(-${pan.x}px, -${pan.y}px) scale(${scale});`} >
    <div
      class='board'
      style={`background-image: url(${images[$game.board.name]})`}>
      <img
        class='spacer'
        src={images[$game.board.name]}
        on:load={setInitialViewport}
        bind:this={background} />
    </div>
  </div>
</div>
{#if $game.players[$username].faction === null}
  <FactionPicker {client} />
{/if}

<svelte:window
  bind:innerWidth={windowWidth}
  bind:innerHeight={windowHeight} />

<style>
.container {
  position: absolute;
  user-select: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.viewport {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: top left;
}

.board {
  pointer-events: none;
  user-select: none;
  background-size: cover;
}

.spacer {
  visibility: hidden;
}
</style>
