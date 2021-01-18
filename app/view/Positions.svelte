<script>
import context from '../context';
import GameMaps from '../types/GameMap';
import Position from './Position.svelte';

const { state } = context();

$: coordinates = do {
  switch ($state.map) {
    case GameMaps.AUTUMN:
      [
        { x: 547, y: 619, slots: [{ x: 430, y: 566 }] },
        { x: 4213, y: 1044, slots: [{ x: 4204, y: 966 }, { x: 4312, y: 1180 }] },
        { x: 4008, y: 3863, slots: [{ x: 3905, y: 3819 }] },
        { x: 548, y: 3622, slots: [{ x: 721, y: 3594 }] },
        { x: 2635, y: 446, slots: [{ x: 2479, y: 340 }, { x: 2739, y: 314 }] },
        { x: 4364, y: 2336, slots: [{ x: 4187, y: 2370 }, { x: 4404, y: 2139 }] },
        { x: 2818, y: 3424, slots: [{ x: 2798, y: 3230 }, { x: 2636, y: 3478 }] },
        { x: 1732, y: 3926, slots: [{ x: 1902, y: 3724 }, { x: 1826, y: 4006 }] },
        { x: 508, y: 1762, slots: [{ x: 608, y: 1642 }, { x: 408, y: 2026 }] },
        { x: 2054, y: 1250, slots: [{ x: 1856, y: 1176 }, { x: 2124, y: 1508 }] },
        { x: 3050, y: 2160, slots: [{ x: 2966, y: 1994 }, { x: 3142, y: 2142 }, { x: 2946, y: 2290 }] },
        { x: 1496, y: 2444, slots: [{ x: 1488, y: 2628 }, { x: 1694, y: 2414 }] },
        { x: 2303, y: 867 },
        { x: 1265, y: 1526 },
        { x: 3003, y: 1689 },
        { x: 826, y: 2629 },
        { x: 1653, y: 3342 },
        { x: 2763, y: 2862 },
        { x: 3865, y: 2812 },
      ];
      break;
  }
};
$: x = ({ id }) => coordinates[id - 1].x;
$: y = ({ id }) => coordinates[id - 1].y;
</script>

{#each $state.positions as position}
  <Position {position} {...coordinates[position.id - 1]} />
{/each}
