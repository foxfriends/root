<script>
  import { ascend, complement, compose, prop, propEq, sortWith } from 'ramda';
  import { memberOf } from '../../util/ramda';
  import context from '../../context';
  import Action from '../component/Action.svelte';
  import Building from '../Building.svelte';
  import OutcastMarker from '../OutcastMarker.svelte';
  import Scale from '../Scale.svelte';
  import Deck, { front, back } from '../Deck.svelte';
  import Factions from '../../types/Faction';
  import Buildings from '../../types/Building';
  import Suits from '../../types/Suit';

  const { state } = context();

  let width;
  let height;
  $: scale = Math.min(width / 2252, height / 1749);
  $: garden = {
    x: [869 * scale, 1037 * scale, 1192 * scale, 1360 * scale, 1529 * scale],
    y: 1264 * scale,
    dy: 160 * scale,
  };
  $: outcast = { x: 1742 * scale, y: 827 * scale, dx: 170 * scale };
  $: lostSouls = { x: 1650 * scale, y: 955 * scale };
  $: acolytes = { x: 850 * scale, y: 767 * scale, w: 716, h: 190 };
  $: craftedItems = { x: 1580 * scale, y: 270 * scale, width: 527 };

  $: currentOutcast = $state.cult.outcast;
  $: hated = $state.cult.hated_outcast;
</script>

<Scale {scale}>
  <div class='container' bind:clientWidth={width} bind:clientHeight={height}>
    <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
      {#if currentOutcast === Suits.MOUSE}
        <OutcastMarker {hated} x={outcast.x} y={outcast.y} />
      {:else if currentOutcast === Suits.RABBIT}
        <OutcastMarker {hated} x={outcast.x + outcast.dx} y={outcast.y} />
      {:else if currentOutcast === Suits.FOX}
        <OutcastMarker {hated} x={outcast.x + outcast.dx * 2} y={outcast.y} />
      {/if}

      <Action action='cult_choose_outcast(Suit)' let:binding let:perform>
        {#if binding.Suit === Suits.MOUSE}
          <OutcastMarker ghost on:click={perform} x={outcast.x} y={outcast.y} />
        {:else if binding.Suit === Suits.RABBIT}
          <OutcastMarker ghost on:click={perform} x={outcast.x + outcast.dx} y={outcast.y} />
        {:else if binding.Suit === Suits.FOX}
          <OutcastMarker ghost on:click={perform} x={outcast.x + outcast.dx * 2} y={outcast.y} />
        {/if}
      </Action>

      <!--
      <div
        class='lost-souls'
        style={`
          transform: translate(${lostSouls.x}px, ${lostSouls.y}px);
          width: ${537 * scale}px;
          height: ${722 * scale}px;
        `}>
        <Pile cards={$game.factionData.cult.lostSouls} />
      </div>
      -->

      <!--
      {#each new Array($game.factionData.cult.garden_mouse).fill(0) as _, i}
        <Piece
          piece={Pieces.cult.garden_mouse}
          x={garden.x[5 - i - 1]}
          y={garden.y}
          {scale} />
      {/each}
      {#each new Array($game.factionData.cult.garden_rabbit).fill(0) as _, i}
        <Piece
          piece={Pieces.cult.garden_rabbit}
          x={garden.x[5 - i - 1]}
          y={garden.y + garden.dy}
          {scale} />
      {/each}
      {#each new Array($game.factionData.cult.garden_fox).fill(0) as _, i}
        <Piece
          piece={Pieces.cult.garden_mouse}
          x={garden.x[5 - i - 1]}
          y={garden.y + 2 * garden.dy}
          {scale} />
      {/each}
      -->

      <!--CraftedItems {...craftedItems} {scale} items={$game.factionData.cult.craftedItems} /-->
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
  background-image: url('./image/board/board.cult-front.jpg');
  background-size: contain;
  background-attachment: top left;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}
</style>
