<script>
import { game, username } from '../../store';
import tokenImages from '../../image/token/token.*.png';
import cardImages from '../../image/card/card-shared-front.*.jpg';
import cardBack from '../../image/card/card-shared-back.jpg';
import Pieces from '../../model/Piece';
import Faction from '../../model/Faction';
import Piece from '../Piece.svelte';
import Deck from '../Deck.svelte';
import Pile from '../Pile.svelte';
import CraftedItems from './CraftedItems.svelte';

let isMe = $game.players[$username].faction === Faction.alliance;
export let width, height;
$: scale = Math.min(width / 2252, height / 1749);
$: base = { x: 1301 * scale, y: 1053 * scale, dx: 154 * scale };
$: sympathy = { x: 2096 * scale, y: 1462 * scale, dx: 153.5 * scale, dy: 71 * scale };
$: officers = { x: 1605 * scale, y: 958 * scale, w: 501, h: 245 };
$: card = { x: 66 * scale, y: 958 * scale };
$: craftedItems = { x: 1528 * scale, y: 280 * scale, width: 555 };
</script>

<div class='container'>
  <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
    {#if $game.factionData.alliance.base_fox}
      <Piece piece={Pieces.alliance.base_fox} x={base.x - base.dx * 2} y={base.y} {scale} />
    {/if}
    {#if $game.factionData.alliance.base_rabbit}
      <Piece piece={Pieces.alliance.base_rabbit} x={base.x - base.dx} y={base.y} {scale} />
    {/if}
    {#if $game.factionData.alliance.base_mouse}
      <Piece piece={Pieces.alliance.base_mouse} x={base.x} y={base.y} {scale} />
    {/if}
    {#each new Array($game.factionData.alliance.sympathy).fill(0) as _, i}
      <Piece piece={Pieces.alliance.sympathy} x={sympathy.x - i * sympathy.dx} y={sympathy.y + (i % 2) * sympathy.dy} {scale} />
    {/each}
    {#if $game.factionData.alliance.supporters.length}
      <div class='supporters' style={`transform: translate(${card.x}px, ${card.y}px); width: ${517 * scale}px; height: ${702 * scale}px`}>
        {#if isMe}
          <Pile cards={$game.factionData.alliance.supporters.map(card => cardImages[card.key])} />
        {:else}
          <Deck
            cardImage={cardBack}
            cardCount={$game.factionData.alliance.supporters.length} />
        {/if}
      </div>
    {/if}
    <div
      class='officers'
      style={`
        left: ${officers.x}px;
        top: ${officers.y}px;
        width: ${officers.w}px;
        height: ${officers.h}px;
        transform: scale(${scale})
      `}>
      {#each $game.factionData.alliance.officers as _}
        <div class='officer'>
          <Piece block piece={Piece.alliance.warrior} scale={0.88} />
        </div>
      {/each}
    </div>
    <CraftedItems {...craftedItems} {scale} items={$game.factionData.alliance.craftedItems} />
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
  background-image: url('../../image/card-alliance-front.jpg');
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
.officer:first {
  margin: -50px 0 0 0;
}
</style>
