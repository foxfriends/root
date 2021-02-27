<script>
  import { getFactionIconPath } from '../util/image';
  import { useScale } from './Scale.svelte';

  const scale = useScale();

  export let faction;
  $: image = getFactionIconPath(faction);
</script>

<div
  class='relationship'
  style={`
    background-image: url(${image});
    width: ${141 * $scale}px;
    height: ${141 * $scale}px;
    transform: translateY(-8px);
  `}
/>

<style>
  .relationship {
    background-size: cover;
    pointer-events: none;
    user-select: none;
    transform-origin: center;
    transition: top 0.2s, left 0.2s;
    border-radius: 16px;
    box-shadow:
      0 0 0 2px rgba(0, 0, 0, 0.6) inset,
      0 3px 0 rgb(179, 174, 166),
      0 7px 0 rgb(198, 185, 165),
      0 9px 0 rgb(113, 107, 97);
  }
</style>
