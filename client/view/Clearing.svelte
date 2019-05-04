<script>
import images from '../image/token/token.*.png';

export let x;
export let y;
export let suit;
export let slots;
export let isCorner;
export let acrossCorner;
export let buildings;
export let pieces;

function image(piece) {
  return images[piece.key];
}

</script>

{#each buildings as building, i}
  {#if building !== null}
    <div
      class='building'
      style={`background-image: url(${image(building)}); left: ${slots[i].x}px; top: ${slots[i].y}px;`} />
  {/if}
{/each}

<style>
.building {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
  border-radius: 20px;
  box-shadow:
    0 1px 0 rgb(179, 174, 166),
    0 5px 0 rgb(198, 185, 165),
    0 6px 0 rgb(179, 174, 166),
    2px 6px 2px rgba(0, 0, 0, 0.25);
  width: 141px;
  height: 141px;
}
</style>
