<script>
  import { useScale } from './Scale.svelte';

  export let warrior;
  export let x = undefined;
  export let y = undefined;

  const scale = useScale();

  $: style = x === undefined && y === undefined
    ? `transform: scale(${$scale});`
    : `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) scale(${$scale});
    `;
</script>

{#if warrior}
  <svg
    class='warrior'
    {style}>
    <use xlink:href={`./image/piece/warriors/token.${warrior.faction}-warrior.svg#warrior`} />
  </svg>
{/if}

<style>
  .warrior {
    pointer-events: none;
    user-select: none;
    transform-origin: center;
    width: 135px;
    height: 169px;
    transition: top 0.2s, left 0.2s;
    filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.7));
  }
</style>
