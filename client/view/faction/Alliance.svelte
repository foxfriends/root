<script>
import { game } from '../../store';
import tokenImages from '../../image/token/token.*.png';
import cardImages from '../../image/card/card-shared-front.*.jpg';
import Piece from '../../model/Piece';
import Faction from '../../model/Faction';
import Token from '../Token.svelte';
import Deck from '../Deck.svelte';

let width, height;
$: scale = Math.min(width / 2252, height / 1749);
$: dxBase = 154 * scale;
$: dxSympathy = 153.5 * scale;
$: dySympathy = 71 * scale;
$: base = { x: 1301 * scale, y: 1053 * scale };
$: sympathy = { x: 2096 * scale, y: 1462 * scale };
$: card = { x: 66 * scale, y: 958 * scale };
</script>

<div class='board' bind:clientWidth={width} bind:clientHeight={height}>
  {#if $game.factionData.alliance.bases.fox}
    <Token square image={tokenImages[Piece.alliance.base_fox.key]} x={base.x - dxBase * 2} y={base.y} {scale} />
  {/if}
  {#if $game.factionData.alliance.bases.rabbit}
    <Token square image={tokenImages[Piece.alliance.base_rabbit.key]} x={base.x - dxBase} y={base.y} {scale} />
  {/if}
  {#if $game.factionData.alliance.bases.mouse}
    <Token square image={tokenImages[Piece.alliance.base_mouse.key]} x={base.x} y={base.y} {scale} />
  {/if}
  {#each new Array($game.factionData.alliance.sympathy).fill(0) as _, i}
    <Token round image={tokenImages[Piece.alliance.sympathy.key]} x={sympathy.x - i * dxSympathy} y={sympathy.y + (i % 2) * dySympathy} {scale} />
  {/each}
  {#if $game.factionData.alliance.supporters.length}
    <div class='supporters' style={`transform: translate(${card.x}px, ${card.y}px); width: ${517 * scale}px; height: ${702 * scale}px`}>
      <Deck
        cardImage={cardImages[$game.factionData.alliance.supporters[$game.factionData.alliance.supporters.length - 1].key]}
        cardCount={$game.factionData.alliance.supporters.length} />
    </div>
  {/if}
</div>

<style>
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
</style>
