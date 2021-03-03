<script>
  import Deck, { front } from '../Deck.svelte';
  import context from '../../context';
  import Scale from '../Scale.svelte';
  import { propEq } from 'ramda';

  const { state } = context();

  let width;
  let height;

  // let isMe = $game.players[$username].faction === Faction.alliance;

  $: scale = Math.min(width / 2252, height / 1749);
  $: base = { x: 1301 * scale, y: 1053 * scale, dx: 154 * scale };
  $: sympathy = { x: 2096 * scale, y: 1462 * scale, dx: 153.5 * scale, dy: 71 * scale };
  $: officers = { x: 1605 * scale, y: 958 * scale, w: 501, h: 245 };
  $: card = { x: 66 * scale, y: 958 * scale };
  $: craftedItems = { x: 1528 * scale, y: 280 * scale, width: 555 };

  $: supporters = $state.alliance_supporters
    .map(({ card }) => front($state.cards.find(propEq('id', card))));
</script>

<Scale {scale}>
  <div class='container' bind:clientWidth={width} bind:clientHeight={height}>
    <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
        <!-- TODO: add rest alliance pices on board -->
        <!--{#if $game.factionData.alliance.base_fox}&ndash;&gt;-->
        <!--      <Piece piece={Pieces.alliance.base_fox} x={base.x - base.dx * 2} y={base.y} {scale} />-->
        <!--    {/if}-->
        <!--    {#if $game.factionData.alliance.base_rabbit}-->
        <!--      <Piece piece={Pieces.alliance.base_rabbit} x={base.x - base.dx} y={base.y} {scale} />-->
        <!--    {/if}-->
        <!--    {#if $game.factionData.alliance.base_mouse}-->
        <!--      <Piece piece={Pieces.alliance.base_mouse} x={base.x} y={base.y} {scale} />-->
        <!--    {/if}-->
        <!--    {#each new Array($game.factionData.alliance.sympathy).fill(0) as _, i}-->
        <!--      <Piece piece={Pieces.alliance.sympathy} x={sympathy.x - i * sympathy.dx} y={sympathy.y + (i % 2) * sympathy.dy} {scale} />-->
        <!--    {/each}-->

        <!--    <div-->
        <!--      class='officers'-->
        <!--      style={`-->
        <!--        left: ${officers.x}px;-->
        <!--        top: ${officers.y}px;-->
        <!--        width: ${officers.w}px;-->
        <!--        height: ${officers.h}px;-->
        <!--        transform: scale(${scale})-->
        <!--      `}>-->
        <!--      {#each $game.factionData.alliance.officers as _}-->
        <!--        <div class='officer'>-->
        <!--          <Piece block piece={Piece.alliance.warrior} scale={0.88} />-->
        <!--        </div>-->
        <!--      {/each}-->
        <!--    </div>-->

      <div class='supporters' style={`
        transform: translate(${card.x}px, ${card.y}px);
        width: ${517 * scale}px;
        height: ${702 * scale}px
      `}>
        <Deck expandable shared cards={supporters} />
      </div>
      <!--CraftedItems {...craftedItems} {scale} items={$game.factionData.alliance.craftedItems} /-->
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
  background-image: url('./image/board/board.alliance-front.jpg');
  background-size: contain;
  background-attachment: top left;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

.supporters {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: top left;
}

.officers {
  display: flex;
  position: absolute;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  transform-origin: top left;
  padding: 20px;
}

.officer {
  margin: -50px 0 0 -50px;
}

.officer:first-child {
  margin: -50px 0 0 0;
}
</style>
