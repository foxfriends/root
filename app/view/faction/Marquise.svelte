<script>
import { complement, compose, prop, propEq } from 'ramda';
import { memberOf } from '../../util/ramda';
import context from '../../context';
import Building from '../Building.svelte';
import Scale from '../Scale.svelte';
import Token from '../Token.svelte';
import Factions from '../../types/Faction';
import Tokens from '../../types/Token';
import Buildings from '../../types/Building';

const { state } = context();

// Piece Positions
let width;
let height;
$: scale = Math.min(width / 2252, height / 1749);
$: tile = { x: 2032 * scale, y: 754 * scale, dx: 174 * scale, dy: 180 * scale };
$: craftedItems = { x: 1600 * scale, y: 286 * scale, width: 512 };
$: wood = { x: 1205 * scale, y: 1481 * scale };

$: builtIds = $state.built_buildings.map(prop('building'));
$: built = compose(memberOf(builtIds), prop('id'));

$: placedIds = $state.placed_tokens.map(prop('token'));
$: placed = compose(memberOf(placedIds), prop('id'));

$: unbuiltBuildings = $state
  .buildings
  .filter(propEq('faction', Factions.MARQUISE))
  .filter(complement(built));
$: unplacedTokens = $state
  .tokens
  .filter(propEq('faction', Factions.MARQUISE))
  .filter(complement(placed));

$: sawmills = unbuiltBuildings.filter(propEq('building', Buildings.SAWMILL));
$: workshops = unbuiltBuildings.filter(propEq('building', Buildings.WORKSHOP));
$: recruiters = unbuiltBuildings.filter(propEq('building', Buildings.RECRUITER));
$: woods = unplacedTokens.filter(propEq('token', Tokens.WOOD));
</script>

<Scale {scale}>
  <div class='container' bind:clientWidth={width} bind:clientHeight={height}>
    <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
      {#each sawmills as building, i (building.id)}
        <Building {building} x={tile.x - tile.dx * i} y={tile.y} />
      {/each}
      {#each workshops as building, i (building.id)}
        <Building {building} x={tile.x - tile.dx * i} y={tile.y + tile.dy} />
      {/each}
      {#each recruiters as building, i (building.id)}
        <Building {building} x={tile.x - tile.dx * i} y={tile.y + 2 * tile.dy} />
      {/each}
      <Token tokens={woods} x={wood.x} y={wood.y} />
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
  background-image: url('./image/board/board.marquise-front.jpg');
  background-size: contain;
  background-attachment: top left;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}
</style>
