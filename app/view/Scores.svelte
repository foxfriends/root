<script>
import { groupBy, prop } from 'ramda';
import context from '../context';
import GameMaps from '../types/GameMap';
import VictoryPointMarker from './VictoryPointMarker.svelte';

const { state } = context();

$: track = do {
  switch ($state.map) {
    case GameMaps.AUTUMN: ({ x: 192, y: 4229 }); break;
  }
};

$: scores = groupBy(prop('points'), $state.factions);
</script>

<!-- TODO#41: this will not animate well, as pieces are added and removed if they are on the same score -->
{#each Object.entries(scores) as [score, factions]}
  <VictoryPointMarker {factions} x={track.x + 146 * score} y={track.y} />
{/each}
