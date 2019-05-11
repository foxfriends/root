<script>
import { game } from '../../store';
import images from '../../image/token/token.*.png';
import Piece from '../../model/Piece';
import Faction from '../../model/Faction';
import Token from '../Token.svelte';

let width, height;
$: scale = Math.min(width / 2252, height / 1749);
$: dx = 174 * scale;
$: dy = 180 * scale;
$: tile = { x: 2032 * scale, y: 754 * scale };
</script>

<div class='board' bind:clientWidth={width} bind:clientHeight={height}>
  {#each new Array($game.factionData.marquise.sawmill).fill(0) as _, i}
    <Token square image={images[Piece.marquise.sawmill.key]} x={tile.x - dx * i} y={tile.y} {scale} />
  {/each}
  {#each new Array($game.factionData.marquise.workshop).fill(0) as _, i}
    <Token square image={images[Piece.marquise.workshop.key]} x={tile.x - dx * i} y={tile.y + dy} {scale} />
  {/each}
  {#each new Array($game.factionData.marquise.recruiter).fill(0) as _, i}
    <Token square image={images[Piece.marquise.recruiter.key]} x={tile.x - dx * i} y={tile.y + 2 * dy} {scale} />
  {/each}
</div>

<style>
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
