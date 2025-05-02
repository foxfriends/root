<script>
  import Pieces from "server/model/Piece.js";
  import Token from "./Token.svelte";

  import allianceWarrior from "../image/token/token.alliance-warrior.svg";
  import eyrieWarrior from "../image/token/token.eyrie-warrior.svg";
  import marquiseWarrior from "../image/token/token.marquise-warrior.svg";
  import vagabondWarrior from "../image/token/token.vagabond-warrior.svg";
  import vagabond2Warrior from "../image/token/token.vagabond2-warrior.svg";

  const tokenVector = {
    "alliance-warrior": allianceWarrior,
    "eyrie-warrior": eyrieWarrior,
    "marquise-warrior": marquiseWarrior,
    "vagabond-warrior": vagabondWarrior,
    "vagabond2-warrior": vagabond2Warrior,
  };

  export let piece;
  export let x = 0,
    y = 0;
  export let scale = 1;
  export let stack = 1;
  export let block = false;
  $: image = tokenVector[piece.key] || `/image/token/token.${piece.key}.png`;
</script>

{#if piece.shape === "square"}
  <Token square {block} {image} {x} {y} {scale} {stack} />
{:else if piece.shape === "round"}
  <Token round {block} {image} {x} {y} {scale} {stack} />
{:else}
  <img
    class="meeple"
    src={image}
    style={`
      position: ${block ? "relative" : "absolute"};
      left: ${x}px;
      top: ${y}px;
      transform: ${block ? "" : "translate(-50%, -50%)"} scale(${scale});
    `}
  />
{/if}

<style>
  .meeple {
    flex-grow: 0;
    flex-shrink: 0;
    pointer-events: none;
    user-select: none;
    transform-origin: center;
    filter: url(#outline);
    transition:
      top 0.2s,
      left 0.2s;
  }
</style>
