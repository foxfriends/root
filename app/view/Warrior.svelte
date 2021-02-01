<script>
  import { useScale } from '../context';

  export let warrior;
  export let x;
  export let y;

  const scale = useScale();
  const size = 8;
</script>

{#if warrior}
  <svg
    class='warrior'
    style={`
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) translateY(-${size * $scale}px) scale(${$scale});
    `}>
    <use xlink:href={`../image/piece/warriors/token.${warrior.faction}-warrior.svg#warrior`} />
  </svg>
{/if}

<style>
  .warrior {
    position: absolute;
    pointer-events: none;
    user-select: none;
    transform-origin: center;
    width: 135px;
    height: 169px;
    transition: top 0.2s, left 0.2s;
    filter: drop-shadow(0 5px 5px rgba(0, 0, 0, 0.7));
  }
</style>
