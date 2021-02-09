<script>
import { game } from '../../store';
import images from '../../image/token/token.*.png';
import Piece from '../../model/Piece';
import Token from '../Token.svelte';
import Deck from '../Deck.svelte';
import CraftedItems from './CraftedItems.svelte';
import { getEyrieLeaderPath } from '../../util/image';

export let width, height;
$: scale = Math.min(width / 2252, height / 1749);
$: tile = { x: 2085 * scale, y: 806 * scale, dx: 159 * scale };
$: card = { x: 1654 * scale, y: 976 * scale };
$: craftedItems = { x: 1531 * scale, y: 501 * scale, width: 555 };
$: decree = { y: 133 * scale, recruit: 0, move: 567 * scale, battle: 1153 * scale, build: 1733 * scale };
</script>

<div class='container'>
  <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
    {#each new Array($game.factionData.eyrie.roost).fill(0) as _, i}
      <Token square image={images[Piece.eyrie.roost.key]} x={tile.x - tile.dx * i} y={tile.y} {scale} />
    {/each}
    {#if $game.factionData.eyrie.leader}
      <div class='leader' style={`transform: translate(${card.x}px, ${card.y}px); width: ${517 * scale}px; height: ${702 * scale}px`}>
        <Deck cardImage={getEyrieLeaderPath($game.factionData.eyrie.leader)} cardCount={1} />
      </div>
    {/if}
    <CraftedItems {...craftedItems} {scale} items={$game.factionData.eyrie.craftedItems} />
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
