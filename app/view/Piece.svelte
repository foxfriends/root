<script>
import Pieces from '../model/Piece';
import tokenVector from '../image/token/token.*.svg';
import tokenImages from '../image/token/token.*.png';
import Token from './Token.svelte';

export let piece;
export let x = 0, y = 0;
export let scale = 1;
export let stack = 1;
export let block = false;
$: image = tokenVector[piece.key] || tokenImages[piece.key];
</script>

{#if piece.shape === 'square'}
  <Token square {block} {image} {x} {y} {scale} {stack} />
{:else if piece.shape === 'round'}
  <Token round {block} {image} {x} {y} {scale} {stack} />
{:else}
  <img
    class='meeple'
    src={image}
    style={`
      position: ${block ? 'relative' : 'absolute'};
      left: ${x}px;
      top: ${y}px;
      transform: ${block ? '' : 'translate(-50%, -50%)'} scale(${scale});
    `} />
{/if}

<style>
.meeple {
  flex-grow: 0;
  flex-shrink: 0;
  pointer-events: none;
  user-select: none;
  transform-origin: center;
  filter: url(#outline);
  transition: top 0.2s, left 0.2s;
}
</style>
