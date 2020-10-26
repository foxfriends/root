<script>
import PRNG from 'prng';
import images from '../image/token/token.*.png';
import Token from './Token.svelte';
import Pieces, { Piece as PieceT } from '../model/Piece';
import Piece from './Piece';

export let seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
export let x, y;
export let slots;
export let buildings;
export let pieces;
export let ruinItems;
export let scale;

function intersects(placement, forces) {
  return forces
    .some(({ x, y, r }) => Math.abs(placement.x - x) < placement.r + r
                     && Math.abs(placement.y - y) < placement.r + r
    )
}

$: arrangedPieces = ((pieces) => {
  // create an RNG with the same seed every time to make a predictable arragment per clearing
  let prng = new PRNG(seed);
  const forces = slots.map(({ x, y }) => ({ x, y, r: 70 }));
  forces.push({ x, y, r: 30 });
  const arrangedPieces = pieces.map((piece, i) => {
    const rngForces = new Array(i).fill(0).map(() => ({ x: x + prng.rand(-325, 325), y: y + prng.rand(-325, 325), r: 0 }));
    const effectiveForces = [...forces, ...rngForces];
    const netForce = effectiveForces
      .map(force => ({ x: x - force.x, y: y - force.y }))
      .reduce(({ x: tx, y: ty }, { x, y }) => ({ x: tx + x, y: ty + y }), { x: 0, y: 0 });
    const forceMagnitude = Math.sqrt(netForce.x ** 2 + netForce.y ** 2);
    let placement = { x, y, r: 70 };
    while (intersects(placement, effectiveForces)) {
      placement.x += Math.max(1, Math.ceil(Math.abs(netForce.x) / forceMagnitude * 35)) * Math.sign(netForce.x);
      placement.y += Math.max(1, Math.ceil(Math.abs(netForce.y) / forceMagnitude * 35)) * Math.sign(netForce.y);
    }
    forces.push({ ...placement });
    return { ...placement, piece };
  });
  return arrangedPieces.sort((a, b) => a.y - b.y);
})(pieces);

function image(piece) {
  return images[piece.key];
}
</script>

{#each buildings as building, i}
  {#if building !== null}
    <Token square
      image={image(building)}
      x={slots[i].x * scale}
      y={slots[i].y * scale}
      {scale}
      stack={PieceT.equals(building, Pieces.ruin) ? ruinItems + 1 : 1} />
  {/if}
{/each}
{#each arrangedPieces as { x, y, piece }}
  <Piece {piece} x={x * scale} y={y * scale} {scale} />
{/each}
