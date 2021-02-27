<script>
  import { propEq } from 'ramda';
  import context from '../context';
  import { getItemImagePath } from '../util/image';
  import { useScale } from './Scale.svelte';

  const scale = useScale();
  const { state } = context();

  export let item;
  export let x = undefined;
  export let y = undefined;
  export let exhausted = false;

  $: ruin = !!$state.ruin_items.find(propEq('item', item.id));
  $: image = getItemImagePath(item.item, ruin);

  $: style = x === undefined && y === undefined
    ? `
      background-image: url(${image});
      width: ${141 * $scale}px;
      height: ${141 * $scale}px;
      transform: translateY(-8px);
    `
    : `
      background-image: url(${image});
      width: ${141 * $scale}px;
      height: ${141 * $scale}px;
      transform: translate(-50%, -50%) translateY(-8px);
      position: absolute;
      left: ${x}px;
      top: ${y}px;
    `;
</script>

<div
  class='item'
  class:exhausted
  {style}
/>

<style>
  .item {
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

  .exhausted {
    opacity: 0.5;
  }
</style>
