<script>
import Pieces from '../model/Piece';
import tokenVector from '../image/token/token.*.svg';
import tokenImages from '../image/token/token.*.png';
import Token from './Token.svelte';

export let piece;
export let x, y;
export let scale = 1;
export let stack = 1;
$: image = tokenVector[piece.key] || tokenImages[piece.key];
</script>

{#if piece.shape === 'square'}
  <Token square {image} {x} {y} {scale} {stack} />
{:else if piece.shape === 'round'}
  <Token round {image} {x} {y} {scale} {stack} />
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
  filter: url(#outline);
  transition: top 0.2s, left 0.2s;
}
</style>
