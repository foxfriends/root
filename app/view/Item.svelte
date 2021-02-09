<script>
  import { useScale } from '../context';
  import { getItemImagePath } from '../util/image';

  const scale = useScale();

  export let item;
  export let x;
  export let y;
  export let ruin = false;
  export let exhausted = false;

  $: image = getItemImagePath(item, ruin);
</script>

<div
  class='item'
  class:exhausted
  style={`
    background-image: url(${image});
    left: ${x}px;
    top: ${y}px;
    transform: translate(-50%, -50%) translateY(-8px) scale(${$scale});
  `}
/>

<style>
  .item {
    position: absolute;
    pointer-events: none;
    user-select: none;
    transform-origin: center;
    width: 141px;
    height: 141px;
    transition: top 0.2s, left 0.2s;
    border-radius: 31px;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.6) inset,
    0 3px 0 rgb(179, 174, 166),
    0 7px 0 rgb(198, 185, 165),
    0 9px 0 rgb(113, 107, 97);
  }

  .exhausted {
    opacity: 0.5;
  }
</style>
