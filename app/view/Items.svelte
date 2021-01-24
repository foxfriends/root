<script>
import { complement, concat, prop, propEq, propSatisfies } from 'ramda';
import { memberOf } from '../util/ramda';
import context from '../context';
import Item from './Item.svelte';
import GameMaps from '../types/GameMap';
import Items from '../types/Item';

const { state } = context();

$: offBoardItems = concat($state.ruin_items, $state.owned_items)
  .map(prop('item'));

$: items = $state
  .items
  .filter(propSatisfies(complement(memberOf(offBoardItems)), 'id'))

$: positions = do {
  const x = 1088;
  const dx = 175;
  const y = [150, 320];

  switch ($state.map) {
    case GameMaps.AUTUMN:
      ({
        [Items.BAG]: [{ x, y: y[0] }, { x, y: y[1] }],
        [Items.BOOT]: [{ x: x + dx, y: y[0] }, { x: x + dx, y: y[1] }],
        [Items.CROSSBOW]: [{ x: x + 2 * dx, y: y[0] }],
        [Items.HAMMER]: [{ x: x + 2 * dx, y: y[1] }],
        [Items.DAGGER]: [{ x: x + 3 * dx, y: y[0] }, { x: x + 3 * dx, y: y[1] }],
        [Items.TEA]: [{ x: x + 4 * dx, y: y[0] }, { x: x + 4 * dx, y: y[1] }],
        [Items.COIN]: [{ x: x + 5 * dx, y: y[0] }, { x: x + 5 * dx, y: y[1] }],
      });
      break;
  }
};

$: index = ({ id, item }) => items
  .filter(propEq('item', item))
  .findIndex(propEq('id', id));
$: x = (item) => positions[item.item][index(item)].x;
$: y = (item) => positions[item.item][index(item)].y;
</script>

{#each items as item}
  <Item {item} x={x(item)} y={y(item)} />
{/each}
