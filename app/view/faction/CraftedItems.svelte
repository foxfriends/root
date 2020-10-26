<script>
import Token from '../Token.svelte';
import tokenImages from '../../image/token/token.*.png';

export let items, x, y, width, scale;
</script>

<div class='items' style={`left: ${x}px; top: ${y}px; width: ${width}px; transform: scale(${scale})`}>
  {#each items as item}
    <div
      class='item'
      style={i === 0 ? '' : `margin-left: ${Math.min(5, (width - (items.length * 146)) / (items.length - 1))}px;`}>
      <Token square block image={tokenImages[item.key]} radius={31} />
    </div>
  {/each}
</div>

<style>
.items {
  box-sizing: border-box;
  position: absolute;
  height: 130px;
  padding-left: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  transform-origin: top left;
}
</style>
