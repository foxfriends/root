<script>
  import { game, prompts } from '../../store';
  import Pieces from '../../model/Piece';
  import Message from '../../model/Message';
  import Suit from '../../model/Suit';
  import Piece from '../Piece.svelte';
  import Pile from '../Pile.svelte';
  import CraftedItems from './CraftedItems.svelte';

  export let width, height;
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

  export let client;
  function notifyOutcast(suit) {
    client.notify(Message.direct('Prompts:outcast', { outcast: suit }));
  }
</script>

<div class='container'>
  <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
    {#if $game.factionData.cult.outcast === Suit.mouse}
      <Piece
        piece={$game.factionData.cult.hated ? Pieces.cult.hated_outcast : Pieces.cult.outcast}
        x={outcast.x}
        y={outcast.y}
        {scale} />
    {:else if $game.factionData.cult.outcast === Suit.rabbit}
      <Piece
        piece={$game.factionData.cult.hated ? Pieces.cult.hated_outcast : Pieces.cult.outcast}
        x={outcast.x + outcast.dx}
        y={outcast.y}
        {scale} />
    {:else if $game.factionData.cult.outcast === Suit.fox}
      <Piece
        piece={$game.factionData.cult.hated ? Pieces.cult.hated_outcast : Pieces.cult.outcast}
        x={outcast.x + 2 * outcast.dx}
        y={outcast.y}
        {scale} />
    {/if}
    {#if $prompts && $prompts.outcast}
      {#each [Suit.mouse, Suit.rabbit, Suit.fox] as suit, i}
        <div
          class='outcast-prompt'
          style={`
            left: ${outcast.x + outcast.dx * i}px;
            top: ${outcast.y}px;
            width: ${141 * scale}px;
            height: ${141 * scale}px;
          `}
          on:click={() => notifyOutcast(suit)} />
      {/each}
    {/if}
    <div
      class='lost-souls'
      style={`
        transform: translate(${lostSouls.x}px, ${lostSouls.y}px);
        width: ${537 * scale}px;
        height: ${722 * scale}px;
      `}>
      <Pile cards={$game.factionData.cult.lostSouls} />
    </div>
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
    <CraftedItems {...craftedItems} {scale} items={$game.factionData.cult.craftedItems} />
  </div>
</div>

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

.outcast-prompt {
  position: absolute;
  border-radius: 20px;
  transform: translate(-50%, -50%);
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.7);
}
</style>
