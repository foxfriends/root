<script>
  import { move } from 'ramda';
  import context, { useScale } from '../context';
  import { getVictoryPointImagePath } from '../util/image';
  import propEq from 'ramda/src/propEq';

  const scale = useScale();
  const { state } = context();

  export let factions;
  export let x;
  export let y;

  let factionsSorted;

  $: {
    let currentIndex = factions.findIndex(propEq('faction', $state.turn));
    factionsSorted = currentIndex !== -1 ? move(currentIndex, factions.length - 1, factions) : factions;
  }
</script>

<div
  class="marker-stack"
  style={`
    transform: translate(-50%, -50%) translateY(-${8 * factions.length * $scale}px) scale(${$scale});
    left: ${x}px;
    top: ${y + factions.length * 10}px;
  `}
>
  {#each factionsSorted as faction, i }
    <div
      class="marker"
      style={`
        background-image: url(${getVictoryPointImagePath(faction.faction)});
        top: -${158 * i}px;
        transform: translateY(${150 * i}px);
      `}
    />
  {/each}
</div>

<style>
  .marker-stack {
    position: absolute;
    width: 141px;
    height: 141px;
  }

  .marker-stack:hover .marker {
    transform: unset !important;
  }

  .marker {
    position: absolute;
    pointer-events: none;
    user-select: none;
    transform-origin: center;
    width: 100%;
    height: 100%;
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.6) inset, 0 3px 0 rgb(179, 174, 166), 0 7px 0 rgb(198, 185, 165), 0 8px 0 rgb(113, 107, 97);
    border-radius: 20px;
    transition: top 0.2s, left 0.2s, transform 0.2s;
    background-size: 100%;
  }
</style>
