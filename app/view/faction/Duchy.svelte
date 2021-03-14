<script>
  import { complement, compose, identity, prop, propEq, times } from 'ramda';
  import { memberOf } from '../../util/ramda';
  import context from '../../context';
  import Building from '../Building.svelte';
  import Token from '../Token.svelte';
  import Scale from '../Scale.svelte';
  import Deck, { front } from '../Deck.svelte';
  import Factions from '../../types/Faction';
  import Buildings from '../../types/Building';
  import Tokens from '../../types/Token';

  const { state } = context();

  let width;
  let height;
  $: scale = Math.min(width / 2252, height / 1749);
  $: ministers = { x: 1358 * scale, y: 962 * scale };
  $: buildings = { x: 1844 * scale, y: 608 * scale, dx: 163 * scale, dy: 166 * scale };
  $: crowns = { x: 120 * scale, y: 1400 * scale };
  $: craftedItems = { x: 1531 * scale, y: 501 * scale, width: 555 }; // TODO: location not confirmed
  $: tunnel = { x: 2105 * scale, y: 1481 * scale };

  $: builtIds = $state.built_buildings.map(prop('building'));
  $: built = compose(memberOf(builtIds), prop('id'));

  $: citadels = $state
    .buildings
    .filter(propEq('faction', Factions.DUCHY))
    .filter(complement(built))
    .filter(propEq('building', Buildings.CITADEL));
  $: markets = $state
    .buildings
    .filter(propEq('faction', Factions.DUCHY))
    .filter(complement(built))
    .filter(propEq('building', Buildings.MARKET));
  $: squires = times(identity, $state.duchy.squire_crown);
  $: nobles = times(identity, $state.duchy.noble_crown);
  $: lords = times(identity, $state.duchy.lord_crown);
  $: unswayedMinisters = $state.ministers
    .filter(complement(prop('swayed')))
    .map(prop('minister'))
    .map(front);

  $: placedIds = $state.placed_tokens.map(prop('token'));
  $: placed = compose(memberOf(placedIds), prop('id'));
  $: tunnels = $state
    .tokens
    .filter(propEq('faction', Factions.DUCHY))
    .filter(complement(placed))
    .filter(propEq('token', Tokens.TUNNEL));
</script>

<Scale {scale}>
  <div class='container' bind:clientWidth={width} bind:clientHeight={height}>
    <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
      {#each citadels as building, i (building.id)}
        <Building {building} x={buildings.x - buildings.dx * i} y={buildings.y} />
      {/each}
      {#each markets as building, i (building.id)}
        <Building {building} x={buildings.x - buildings.dx * i} y={buildings.y + buildings.dy} />
      {/each}
      <div class='minister' style={`
        transform: translate(${ministers.x}px, ${ministers.y}px);
        width: ${517 * scale}px;
        height: ${702 * scale}px
      `}>
        <Deck expandable ministers cards={unswayedMinisters} />
      </div>
      <Token tokens={tunnels} x={tunnel.x} y={tunnel.y} />
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
    background-image: url('./image/board/board.duchy-front.jpg');
    background-size: contain;
    background-attachment: top left;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }

  .minister {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: top left;
  }
</style>
