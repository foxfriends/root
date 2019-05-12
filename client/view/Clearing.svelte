<script>
import PRNG from 'prng';
import images from '../image/token/token.*.png';
import Token from './Token.svelte';
import Pieces, { Piece as PieceT } from '../model/Piece';
import Piece from './Piece';

export let seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
export let index;
export let x, y;
export let slots;
export let buildings;
export let pieces;
export let ruinItems;

function intersects(placement, forces) {
  return forces
    .some(({ x, y }) => Math.abs(placement.x - x) < 70
                     || Math.abs(placement.y - y) < 70
    )
}

$: arrangedPieces = ((pieces) => {
  let arrangedPieces = [];
  // create an RNG with the same seed every time to make a predictable arragment per clearing
  let prng = new PRNG(seed);
  const forces = slots.map(({ x, y }) => ({ x, y, r: 70 }));
  forces.push({ x, y, r: 30 });
  for (const piece of pieces) {
    const rngForce = { x: x + prng.rand(-325, 325), y: y + prng.rand(-325, 325), r: 0 }
    const effectiveForces = [...forces, rngForce];
    const netForce = effectiveForces
      .map(force => ({ x: x - force.x, y: y - force.y }))
      .reduce(({ x: tx, y: ty }, { x, y }) => ({ x: tx + x, y: ty + y }), { x: 0, y: 0 });
    const forceMagnitude = Math.sqrt(netForce.x ** 2 + netForce.y ** 2);
    let placement = { x, y };
    while (intersects(placement, effectiveForces)) {
      placement.x += Math.ceil(forceMagnitude / netForce.x);
      placement.y += Math.ceil(forceMagnitude / netForce.y);
    }
    arrangedPieces.push({ ...placement, piece });
    forces.push({ ...placement, r: 70 });
  }
  return arrangedPieces;
})(pieces);

function image(piece) {
  return images[piece.key];
}
</script>

{#each buildings as building, i}
  {#if building !== null}
    <Token square
      image={image(building)}
      x={slots[i].x}
      y={slots[i].y}
      stack={PieceT.equals(building, Pieces.ruin) ? ruinItems + 1 : 1} />
  {/if}
  {#each arrangedPieces as { x, y, piece }}
    <Piece {piece} {x} {y} />
  {/each}
{/each}
