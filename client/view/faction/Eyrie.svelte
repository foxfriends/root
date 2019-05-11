<script>
import { game } from '../../store';
import leaderImages from '../../image/card/card-eyrie_leader-front.*.jpg';
import images from '../../image/token/token.*.png';
import Piece from '../../model/Piece';
import Faction from '../../model/Faction';
import Token from '../Token.svelte';
import Deck from '../Deck.svelte';

let width, height;
$: scale = Math.min(width / 2252, height / 1749);
$: dx = 159 * scale;
$: tile = { x: 2085 * scale, y: 806 * scale };
$: card = { x: 1654 * scale, y: 976 * scale };
</script>

<div class='board' bind:clientWidth={width} bind:clientHeight={height}>
  {#each new Array($game.factionData.eyrie.roost).fill(0) as _, i}
    <Token square image={images[Piece.eyrie.roost.key]} x={tile.x - dx * i} y={tile.y} {scale} />
  {/each}
  {#if $game.factionData.eyrie.leader}
    <div class='leader' style={`transform: translate(${card.x}px, ${card.y}px); width: ${517 * scale}px; height: ${702 * scale}px`}>
      <Deck cardImage={leaderImages[$game.factionData.eyrie.leader]} cardCount={1} />
    </div>
  {/if}
</div>

<style>
.board {
  position: relative;
  background-image: url('../../image/card-eyrie-front.jpg');
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
}
</style>
