<script>
import { game, username } from '../store';
import images from '../image/map-*.jpg';
import FactionPicker from './FactionPicker.svelte';
import Clearing from './Clearing.svelte';

let background;
let boardWidth;
let boardHeight;
let windowWidth;
let windowHeight;

const maxScale = 1;
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

function zoom({ clientX, clientY, deltaY }) {
  // TODO: make this smoother
  const pointUnderCursor = {
    x: (pan.x + clientX) / scale,
    y: (pan.y + clientY) / scale,
  };

  if (deltaY < 0 && scale !== maxScale) {
    targetScale += 1 / ((2 - scale) ** 2) / 10;
    targetPan = {
      x: (pointUnderCursor.x * Math.min(maxScale, targetScale)) - clientX,
      y: (pointUnderCursor.y * Math.min(maxScale, targetScale)) - clientY,
    };
  } else if (deltaY > 0 && scale !== minScale) {
    targetScale -= 1 / ((2 - scale) ** 2) / 10;
    targetPan = {
      x: (pointUnderCursor.x * Math.max(minScale, targetScale)) - clientX,
      y: (pointUnderCursor.y * Math.max(minScale, targetScale)) - clientY,
    };
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
  on:mousemove={drag}>
  <div
    class='viewport'
    style={`transform: translate(-${pan.x}px, -${pan.y}px) scale(${scale});`}>
    <div
      class='board'
      style={`background-image: url(${images[$game.board.name]})`}>
      <img
        class='spacer'
        src={images[$game.board.name]}
        on:load={setInitialViewport}
        bind:this={background} />
    </div>
    {#each $game.board.clearings as clearing}
      <Clearing {...clearing} />
    {/each}
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
