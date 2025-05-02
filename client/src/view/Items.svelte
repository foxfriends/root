<script>
  import { game } from "../store";
  import Token from "./Token.svelte";

  export let scale;

  function image(piece) {
    return `/image/token/token.${piece.key}.png`;
  }
</script>

{#each $game.items as item, index}
  <Token
    square
    {scale}
    image={image(item)}
    x={scale *
      $game.board.itemSlots[item.name][
        $game.items.slice(0, index).filter((i) => i.name === item.name).length
      ].x}
    y={scale *
      $game.board.itemSlots[item.name][
        $game.items.slice(0, index).filter((i) => i.name === item.name).length
      ].y}
    radius={31}
  />
{/each}
