<script>
import { clamp } from 'ramda';
import boardImage from '../image/map';
import context, { useScale } from '../context';
import Positions from './Positions.svelte';
import Items from './Items.svelte';
import Scores from './Scores.svelte';

const { state } = context();
useScale(1);

let boardWidth, boardHeight;
let tableWidth, tableHeight;

const maxScale = 1;
let targetScale = 0;
$: minScale = Math.max(tableWidth / boardWidth, tableHeight / boardHeight);
$: scale = clamp(minScale, maxScale, targetScale);

let targetPan = { x: 0, y: 0 };
$: pan = {
  x: Math.floor(clamp(0, boardWidth * scale - tableWidth, targetPan.x)),
  y: Math.floor(clamp(0, boardHeight * scale - tableHeight, targetPan.y)),
};

function setInitialViewport(event) {
  ({ naturalWidth: boardWidth, naturalHeight: boardHeight } = event.target);
}

function zoom({ clientX, clientY, deltaY }) {
  targetScale = scale;
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
</script>

<div
  bind:clientWidth={tableWidth}
  bind:clientHeight={tableHeight}
  class='container'
  on:wheel={zoom}
  on:mousemove={drag}>
  <div
    class='viewport'
    style='transform: translate(-{pan.x}px, -{pan.y}px) scale({scale});'>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      class='board'
      src={boardImage($state.map)}
      on:load={setInitialViewport} />
    <Positions />
    <Items />
    <Scores />
  </div>
</div>

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
  transform-origin: top left;
}
</style>
