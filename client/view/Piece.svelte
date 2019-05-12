<script>
import Pieces from '../model/Piece';
import tokenImages from '../image/token/token.*.png';
import Token from './Token.svelte';

export let piece;
export let x, y;
export let scale = 1;
$: image = tokenImages[piece.key];
</script>

{#if piece.shape === 'square'}
  <Token square {image} {x} {y} {scale} />
{:else if piece.shape === 'round'}
  <Token round {image} {x} {y} {scale} />
{:else}
  <img
    class='meeple'
    src={image}
    style={`
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) scale(${scale});
    `} />
{/if}

<style>
.meeple {
  position: absolute;
  pointer-events: none;
  user-select: none;
  transform-origin: center;
}
</style>
