<script>
  import { getOutcastImagePath } from '../util/image';
  import { useScale } from './Scale.svelte';

  const scale = useScale();

  export let x;
  export let y;
  export let hated = false;
  export let ghost = false;

  $: image = getOutcastImagePath(hated);
</script>

<div
  on:click
  class:ghost
  class='outcast'
  style={`
    background-image: url(${image});
    top: ${y}px;
    left: ${x}px;
    width: ${110 * $scale}px;
    height: ${110 * $scale}px;
  `}
/>

<style>
  .outcast {
    position: absolute;
    background-size: cover;
    user-select: none;
    transform-origin: center;
    transform: translate(-50%, -50%) translateY(-8px);
    transition: top 0.2s, left 0.2s;
    border-radius: 16px;
    box-shadow:
      0 0 0 2px rgba(0, 0, 0, 0.6) inset,
      0 3px 0 rgb(179, 174, 166),
      0 7px 0 rgb(198, 185, 165),
      0 9px 0 rgb(113, 107, 97);

    &.ghost {
      cursor: pointer;
      filter: grayscale(75%);
      opacity: 0.5;

      &:hover {
        opacity: 0.7;
      }
    }
  }
</style>
