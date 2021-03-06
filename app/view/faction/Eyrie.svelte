<script>
  import { ascend, complement, compose, prop, propEq, sortWith } from 'ramda';
  import { memberOf } from '../../util/ramda';
  import context from '../../context';
  import Building from '../Building.svelte';
  import Scale from '../Scale.svelte';
  import Deck, { front, back } from '../Deck.svelte';
  import Factions from '../../types/Faction';
  import Buildings from '../../types/Building';

  const { state } = context();

  let width;
  let height;
  $: scale = Math.min(width / 2252, height / 1749);
  $: tile = { x: 2085 * scale, y: 806 * scale, dx: 159 * scale };
  $: card = { x: 1654 * scale, y: 976 * scale };
  $: craftedItems = { x: 1531 * scale, y: 501 * scale, width: 555 };
  $: decree = { y: 133 * scale, recruit: 0, move: 567 * scale, battle: 1153 * scale, build: 1733 * scale };

  $: builtIds = $state.built_buildings.map(prop('building'));
  $: built = compose(memberOf(builtIds), prop('id'));

  $: roosts = $state
    .buildings
    .filter(propEq('faction', Factions.EYRIE))
    .filter(complement(built))
    .filter(propEq('building', Buildings.ROOST));

  $: currentLeader = $state.eyrie_current_leader.leader;
  const currentFirst = (lhs, rhs) => {
    if (lhs.leader === currentLeader) { return -1; }
    if (rhs.leader === currentLeader) { return 1; }
    return 0;
  };
  $: leaders = sortWith([currentFirst, ascend(prop('used'))], $state.eyrie_leaders)
    .map(({ leader, used }, i) => (used && i !== 0 ? back : front)(leader));
</script>

<Scale {scale}>
  <div class='container' bind:clientWidth={width} bind:clientHeight={height}>
    <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
      {#each roosts as building, i (building.id)}
        <Building {building} x={tile.x - tile.dx * i} y={tile.y} />
      {/each}
      {#if $state.eyrie_current_leader}
        <div class='leader' class:unchosen={!currentLeader} style={`
          transform: translate(${card.x}px, ${card.y}px);
          width: ${517 * scale}px;
          height: ${702 * scale}px
        `}>
          <Deck expandable leaders cards={leaders} />
        </div>
      {/if}
      <!--CraftedItems {...craftedItems} {scale} items={$game.factionData.marquise.craftedItems} /-->
    </div>
  </div>
</Scale>

<style>
  .container {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .board {
    position: relative;
    background-image: url('./image/board/board.eyrie-front.jpg');
    background-size: contain;
    background-attachment: top left;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }

  .leader {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: top left;

    &.unchosen {
      filter: grayscale(70%);
    }
  }
</style>
