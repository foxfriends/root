<script>
  import { complement, compose, identity, prop, propEq, times } from 'ramda';
  import { memberOf } from '../../util/ramda';
  import context from '../../context';
  import Token from '../Token.svelte';
  import Scale from '../Scale.svelte';
  import Factions from '../../types/Faction';
  import Tokens from '../../types/Token';

  const { state, socket } = context();

  $: isConspiracy = $state
    .factions
    .find(propEq('player', socket.name))
    .faction === Factions.CONSPIRACY;

  let width;
  let height;
  $: scale = Math.min(width / 2252, height / 1749);
  $: craftedItems = { x: 1531 * scale, y: 501 * scale, width: 555 }; // TODO: location not confirmed
  $: plot = { x: 2105 * scale, y: 1481 * scale };

  $: placedIds = $state.placed_tokens.map(prop('token'));
  $: placed = compose(memberOf(placedIds), prop('id'));

  $: plots = $state
    .tokens
    .filter(propEq('faction', Factions.CONSPIRACY))
    .filter(complement(placed));

  $: bombs = plots.filter(propEq('token', Tokens.BOMB));
  $: snares = plots.filter(propEq('token', Tokens.SNARE));
  $: extortions = plots.filter(propEq('token', Tokens.EXTORTION));
  $: raids = plots.filter(propEq('token', Tokens.RAID));
</script>

<Scale {scale}>
  <div class='container' bind:clientWidth={width} bind:clientHeight={height}>
    <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
      {#if isConspiracy}
        <Token tokens={bombs} x={plot.x} y={plot.y} />
        <Token tokens={snares} x={plot.x} y={plot.y + 200} />
        <Token tokens={extortions} x={plot.x} y={plot.y + 400} />
        <Token tokens={raids} x={plot.x} y={plot.y + 600} />
      {:else}
        <Token tokens={plots} x={plot.x} y={plot.y} />
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
    background-image: url('./image/board/board.conspiracy-front.jpg');
    background-size: contain;
    background-attachment: top left;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }
</style>
