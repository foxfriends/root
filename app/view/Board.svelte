<script>
  import { clamp } from 'ramda';
  import context from '../context';
  import Scale from './Scale.svelte';
  import Positions from './Positions.svelte';
  import Items from './Items.svelte';
  import Scores from './Scores.svelte';
  import { getMapImagePath } from '../util/image';

  const { state } = context();

  let boardWidth, boardHeight;
  let tableWidth, tableHeight;

  const maxScale = 1;
  let targetScale = 0;
  $: minScale = Math.min(Math.max(tableWidth / boardWidth, tableHeight / boardHeight), maxScale);
  $: scale = clamp(minScale, maxScale, targetScale);

  let targetPan = { x: 0, y: 0 };
  $: pan = {
    x: Math.floor(clamp(0, Math.max(0, boardWidth * scale - tableWidth), targetPan.x)),
    y: Math.floor(clamp(0, Math.max(0, boardHeight * scale - tableHeight), targetPan.y)),
  };

  let viewport;
  function setInitialViewport(event) {
    ({ naturalWidth: boardWidth, naturalHeight: boardHeight } = event.target);
    const left = parseInt(window.getComputedStyle(viewport).getPropertyValue('padding-left'), 10);
    const right = parseInt(window.getComputedStyle(viewport).getPropertyValue('padding-left'), 10);
    const top = parseInt(window.getComputedStyle(viewport).getPropertyValue('padding-left'), 10);
    const bottom = parseInt(window.getComputedStyle(viewport).getPropertyValue('padding-left'), 10);
    boardWidth += left + right;
    boardHeight += top + bottom;
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

<Scale scale={1}>
  <div
    bind:clientWidth={tableWidth}
    bind:clientHeight={tableHeight}
    class='container'
    on:wheel={zoom}
    on:mousemove={drag}>
    <div
      class='viewport'
      style='transform: translate(-{pan.x}px, -{pan.y}px) scale({scale});'
      bind:this={viewport}>
      <!-- svelte-ignore a11y-missing-attribute -->
      <div class='piece-area'>
        <img
          class='board'
          src={getMapImagePath($state.map)}
          on:load={setInitialViewport} />
        <Positions />
        <Items />
        <Scores />
      </div>
    </div>
  </div>
</Scale>

<style>
  .container {
    position: absolute;
    user-select: none;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .viewport {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    padding: 128px;
    transform-origin: top left;
  }

  .piece-area {
    position: relative;
  }

  .board {
    pointer-events: none;
    user-select: none;
    transform-origin: top left;
  }
</style>
