<script>
import images from '../image/token/token.*.png';
import Token from './Token.svelte';

export let slots;
export let buildings;
export let pieces;

function image(piece) {
  return images[piece.key];
}

</script>

{#each buildings as building, i}
  {#if building !== null}
    <Token square
      image={image(building)}
      x={slots[i].x}
      y={slots[i].y} />
  {/if}
{/each}
