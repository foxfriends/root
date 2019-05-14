<script>
import { game } from '../../store';
import Pieces from '../../model/Piece';
import Faction from '../../model/Faction';
import Piece from '../Piece.svelte';

export let width, height;
$: scale = Math.min(width / 2252, height / 1749);
$: tile = { x: 2032 * scale, y: 754 * scale, dx: 174 * scale, dy: 180 * scale };
$: craftedItems = { x: 1600 * scale, y: 286 * scale };
$: wood = { x: 1085, y: 1551 };
</script>

<div class='container'>
  <div class='board' style={`width: ${2252 * scale}px; height: ${1749 * scale}px`}>
    {#each new Array($game.factionData.marquise.sawmill).fill(0) as _, i}
      <Piece piece={Piece.marquise.sawmill} x={tile.x - tile.dx * i} y={tile.y} {scale} />
    {/each}
    {#each new Array($game.factionData.marquise.workshop).fill(0) as _, i}
      <Piece image={Piece.marquise.workshop} x={tile.x - tile.dx * i} y={tile.y + tile.dy} {scale} />
    {/each}
    {#each new Array($game.factionData.marquise.recruiter).fill(0) as _, i}
      <Piece image={Piece.marquise.recruiter} x={tile.x - tile.dx * i} y={tile.y + 2 * tile.dy} {scale} />
    {/each}
    <Piece image={Piece.marquise.wood} x={tile.x - tile.dx * i} y={tile.y + 2 * tile.dy} {scale} stack={$game.factionData.marquise.wood} />
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
  background-image: url('../../image/card-marquise-front.jpg');
  background-size: contain;
  background-attachment: top left;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}
</style>
