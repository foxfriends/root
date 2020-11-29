<script>
import IMG_MAP_AUTUMN from '../image/map-autumn.jpg';

let boardWidth, boardHeight;
export let tableWidth, tableHeight;

const maxScale = 1;
let targetScale = 0;
$: minScale = Math.max(tableWidth / boardWidth, tableHeight / boardHeight);
$: scale = Math.min(Math.max(minScale, targetScale), maxScale);

let targetPan = { x: 0, y: 0 };
$: pan = {
  x: Math.floor(Math.min(Math.max(0, targetPan.x), boardWidth * scale - tableWidth)),
  y: Math.floor(Math.min(Math.max(0, targetPan.y), boardHeight * scale - tableHeight)),
};

function setInitialViewport(event) {
  ({ naturalWidth: boardWidth, naturalHeight: boardHeight } = event.target);
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
</script>

<div
  class='container'
  on:wheel={zoom}
  on:mousemove={drag}>
  <div
    class='viewport'
    style='transform: translate(-{pan.x}px, -{pan.y}px) scale({scale});'>
    <!-- svelte-ignore a11y-missing-attribute -->
    <img
      class='board'
      src={IMG_MAP_AUTUMN}
      on:load={setInitialViewport} />
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
