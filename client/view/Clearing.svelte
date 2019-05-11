<script>
import images from '../image/token/token.*.png';
import Token from './Token.svelte';
import Pieces, { Piece } from '../model/Piece';

export let slots;
export let buildings;
export let pieces;
export let ruinItems;

function image(piece) {
  return images[piece.key];
}

</script>

{#each buildings as building, i}
  {#if building !== null}
    <Token square
      image={image(building)}
      x={slots[i].x}
      y={slots[i].y}
      stack={Piece.equals(building, Pieces.ruin) ? ruinItems + 1 : 1} />
  {/if}
{/each}
