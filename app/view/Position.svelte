<script>
  import Chance from 'chance';
  import { __, add, ascend, assoc, compose, evolve, find, identity, last, mergeWith, objOf, prop, propEq, subtract } from 'ramda';
  import context from '../context';
  import Token from './Token.svelte';
  import Building from './Building.svelte';
  import Buildings from '../types/Building';
  import Action from './component/Action.svelte';
  import ClearingPrompt from './ClearingPrompt.svelte';
  import { l } from '../util/localization';
  import Warrior from './Warrior.svelte';

  const { state } = context();

  export let position;
  export let x;
  export let y;
  export let slots = [];
  export let seed = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);

  const intersects = (placement, forces) => forces
    .some(({ x, y, r }) => {
      const radius = placement.r + r;
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
  $: vagabonds = [$state.vagabond, $state.vagabond2]
    .filter(identity)
    .filter(propEq('position', position.id));
  $: pieces = [...tokens.map(objOf('token')), ...warriors.map(objOf('warrior')), ...vagabonds.map(objOf('vagabond'))];

  $: arrangedPieces = do {
    // create an RNG with the same seed every time to make a predictable arragment per clearing
    const rng = new Chance(seed);
    const forces = slots.map(assoc('r', 40));
    forces.push({ x, y, r: 30 });
    pieces
      .map((piece, i) => {
        const rngForces = new Array(i)
          .fill(0)
          .map(() => ({
            x: x + rng.integer({ min: -325, max: 325 }),
            y: y + rng.integer({ min: -325, max: 325 }),
            r: 0,
          }));
        const effectiveForces = [...forces, ...rngForces];
        const netForce = effectiveForces
          .map(evolve({ x: subtract(x), y: subtract(y) }))
          .reduce(mergeWith(add), { x: 0, y: 0 });
        const forceMagnitude = Math.sqrt(netForce.x ** 2 + netForce.y ** 2);
        const placement = { x, y, r: 40 };
        while (forceMagnitude && intersects(placement, effectiveForces)) {
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
{#each arrangedPieces as { x, y, piece: { token, warrior, vagabond } }}
  {#if token}
    <Token tokens={[token]} {x} {y} />
  {:else if warrior}
    <Warrior warrior={warrior} {x} {y} />
  {:else if vagabond}
    <Warrior warrior={{ faction: vagabond.faction }} {x} {y} />
  {/if}
{/each}

<Action action='place_token[T, {position.id}]' let:perform let:binding>
  <ClearingPrompt on:click={perform} tooltip={l`tooltip-place`({ piece: binding.T })} {x} {y} />
</Action>

<Action action='place_building[B, {position.id}]' let:perform let:binding>
  <ClearingPrompt on:click={perform} tooltip={l`tooltip-place`({ piece: binding.B })} {x} {y} />
</Action>

<Action action='place_warrior[F, {position.id}]' let:perform let:binding>
  <ClearingPrompt on:click={perform} tooltip={l`tooltip-place`({ piece: binding.F })} {x} {y} />
</Action>

<Action action='place_vagabond({position.id})' let:perform let:binding>
  <ClearingPrompt on:click={perform} tooltip={l`tooltip-place`({ piece: 'Vagabond' })} {x} {y} />
</Action>
