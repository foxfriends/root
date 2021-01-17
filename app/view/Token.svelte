<script>
import tokenImage from '../image/piece/token';

export let tokens;
export let x;
export let y;
export let scale = 1;

$: boxShadow = tokens
  .map((_, i) => `0 ${8 * i + 3}px 0 rgb(179, 174, 166), 0 ${8 * i + 7}px 0 rgb(198, 185, 165), 0 ${8 * i + 8}px 0 rgb(113, 107, 97)`)
  .join(',');
</script>

{#if tokens.length}
  <div
    class='token'
    style={`
      background-image: url(${tokenImage(tokens[0])});
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) translateY(-${8 * tokens.length * scale}px) scale(${scale});
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.6) inset, ${boxShadow};
    `}
    />
{/if}

<style>
.token {
  position: absolute;
  pointer-events: none;
  user-select: none;
  transform-origin: center;
  border-radius: 50%;
  width: 135px;
  height: 135px;
  transition: top 0.2s, left 0.2s;
}
</style>
