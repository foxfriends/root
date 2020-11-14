<script>
import { game } from '../store';
import tokenImages from '../image/token/token.*.png';
import Token from './Token.svelte';

export let scale;
</script>

{#each $game.items as item, index}
  <Token square
    {scale}
    image={tokenImages[item.key]}
    x={scale * $game.board.itemSlots[item.name][$game.items.slice(0, index).filter((i) => i.name === item.name).length].x}
    y={scale * $game.board.itemSlots[item.name][$game.items.slice(0, index).filter((i) => i.name === item.name).length].y}
    radius={31} />
{/each}
