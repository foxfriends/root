<script>
import { game } from '../../store';
import Pieces from '../../model/Piece';
import Faction from '../../model/Faction';
import Piece from '../Piece.svelte';

let width, height;
$: scale = Math.min(width / 2252, height / 1749);
$: payments = { x: 1020 * scale, y: 502 * scale, w: 514, h: 279 };
$: funds = { x: 1020 * scale, y: 851 * scale, w: 514, h: 474 };
$: commitments = { x: 1020 * scale, y: 1400 * scale, w: 514, h: 277 };

$: services = { x: 1800 * scale, y: 630 * scale, dx: 104 * scale, dy: 110 * scale };
$: tradePosts = { x: 2093 * scale, y: 1280 * scale, dx: 165 * scale, dy: 160 * scale };
$: craftedItems = { x: 1528 * scale, y: 280 * scale };
</script>

<div class='board' bind:clientWidth={width} bind:clientHeight={height}>
  {#each new Array($game.factionData.riverfolk.trade_post_fox).fill(0) as _, i}
    <Piece
      piece={Pieces.riverfolk.trade_post_fox}
      x={tradePosts.x - i * tradePosts.dx}
      y={tradePosts.y}
      {scale}
      />
  {/each}
  {#each new Array($game.factionData.riverfolk.trade_post_rabbit).fill(0) as _, i}
    <Piece
      piece={Pieces.riverfolk.trade_post_rabbit}
      x={tradePosts.x - i * tradePosts.dx}
      y={tradePosts.y + tradePosts.dy}
      {scale}
      />
  {/each}
  {#each new Array($game.factionData.riverfolk.trade_post_mouse).fill(0) as _, i}
    <Piece
      piece={Pieces.riverfolk.trade_post_mouse}
      x={tradePosts.x - i * tradePosts.dx}
      y={tradePosts.y + 2 * tradePosts.dy}
      {scale}
      />
  {/each}

  <div
    class='price-marker'
    style={`
      transform: translate(
        ${services.x + services.dx * ($game.factionData.riverfolk.services.handCard - 1)}px,
        ${services.y}px
      ) translateY(-${24 * scale}px) scale(${scale}) translate(-50%, -50%)`} />
  <div
    class='price-marker'
    style={`
      transform: translate(
        ${services.x + services.dx * ($game.factionData.riverfolk.services.riverboats - 1)}px,
        ${services.y + services.dy}px
      ) translateY(-${24 * scale}px) scale(${scale}) translate(-50%, -50%)`} />
  <div
    class='price-marker'
    style={`
      transform: translate(
        ${services.x + services.dx * ($game.factionData.riverfolk.services.mercenaries - 1)}px,
        ${services.y + services.dy * 2}px
      ) translateY(-${24 * scale}px) scale(${scale}) translate(-50%, -50%)`} />
</div>

<style>
.board {
  position: relative;
  background-image: url('../../image/card-riverfolk-front.jpg');
  background-size: contain;
  background-attachment: top left;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

.price-marker {
  position: absolute;
  width: 93px;
  height: 93px;
  border-radius: 100%;
  background-color: rgb(96, 210, 207);
  box-shadow: 0 24px 0 rgb(91, 180, 177);
  transition: transform 0.2s;
  transform-origin: top left;
}
</style>
