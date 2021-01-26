<script>
import Prng from 'prng';
import { __, add, ascend, assoc, compose, concat, evolve, find, last, mergeWith, prop, propEq, subtract } from 'ramda';
import { build } from '../util/ramda';
import context from '../context';
import Token from './Token.svelte';
import Building from './Building.svelte';
import Buildings from '../types/Building';
// TODO: warriors

const { state } = context();

export let position;
export let x;
export let y;
export let slots = [];
export let seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

const intersects = (placement, forces) => forces
  .some(({ x, y, r }) => {
    const radius = placement.r - r;
    return Math.abs(placement.x - x) < radius && Math.abs(placement.y - y) < radius;
  });

$: buildings = $state
  .built_buildings
  .filter(propEq('position', position.id))
  .map(compose(find(__, $state.buildings), propEq('id'), prop('building')));
$: ruinItems = $state
  .ruin_items
  .filter(propEq('clearing', position.id))
  .map(compose(find(__, $state.items), propEq('id'), prop('item')));
$: tokens = $state
  .placed_tokens
  .filter(propEq('position', position.id))
  .map(compose(find(__, $state.tokens), propEq('id'), prop('token')));
$: warriors = $state
  .placed_warriors
  .filter(propEq('position', position.id))
  .map(compose(find(__, $state.warriors), propEq('id'), prop('warrior')));
$: pieces = concat(tokens.map(build('token')), warriors.map(build('warrior')));

$: arrangedPieces = do {
  // create an RNG with the same seed every time to make a predictable arragment per clearing
  const prng = new Prng(seed);
  const forces = slots.map(assoc('r', 70));
  forces.push({ x, y, r: 30 });
  pieces
    .map((piece, i) => {
      const rngForces = new Array(i)
        .fill(0)
        .map(() => ({ x: x + prng.rand(-325, 325), y: y + prng.rand(-325, 325), r: 0 }));
      const effectiveForces = concat(forces, rngForces);
      const netForce = effectiveForces
        .map(evolve({ x: subtract(x), y: subtract(y) }))
        .reduce(mergeWith(add), { x: 0, y: 0 });
      const forceMagnitude = Math.sqrt(netForce.x ** 2 + netForce.y ** 2);
      const placement = { x, y, r: 70 };
      while (intersects(placement, effectiveForces)) {
        placement.x += Math.max(1, Math.ceil(Math.abs(netForce.x) / forceMagnitude * 35)) * Math.sign(netForce.x);
        placement.y += Math.max(1, Math.ceil(Math.abs(netForce.y) / forceMagnitude * 35)) * Math.sign(netForce.y);
      }
      forces.push(placement);
      return { ...placement, piece };
    })
    .sort(ascend(prop('y')));
};
</script>

{#each buildings as building, i}
  <Building
    {building}
    x={slots[i].x}
    y={slots[i].y}
    />
{/each}
{#if ruinItems.length}
  <Building
    building={{ building: Buildings.RUIN }}
    x={last(slots).x}
    y={last(slots).y}
    stack={ruinItems.length + 1}
    />
{/if}
{#each arrangedPieces as { x, y, piece: { token, warrior } }}
  {#if token}
    <Token {token} {x} {y} />
  {:else if warrior}
    <!-- TODO -->
  {/if}
{/each}