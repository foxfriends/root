<script>
  import { useScale } from '../context';
  import logger from '../util/logger';
  import warriorImage from '../image/piece/warriors/warrior';

  export let warriors;
  export let x;
  export let y;

  const scale = useScale();
  const size = 8;
  
  logger.log(warriorImage);
</script>

{#if warriors.length}
  <div
    class='warrior'
    style={`
      background-image: url(${warriorImage(warriors[0])});
      left: ${x}px;
      top: ${y}px;
      transform: translate(-50%, -50%) translateY(-${size * warriors.length * $scale}px) scale(${$scale});
    `}
  />
{/if}

<style>
  .warrior {
    position: absolute;
    pointer-events: none;
    user-select: none;
    transform-origin: center;
    width: 135px;
    height: 180px;
    transition: top 0.2s, left 0.2s;
  }
</style>
