<script>
import { game } from '../store';
import images from '../image/token/token.*-victory_points.png';
import Token from './Token.svelte';

export let scale;

$: track = $game.board.scoreTrack;
$: scores = Object.entries($game.factionData)
  .map(([name, { victoryPoints }]) => ({ score: victoryPoints, faction: name }))
  .reduce((acc, { score, faction }) => {
    acc[score] = acc[score] || [];
    acc[score].push(faction);
    return acc;
  }, {});
</script>

{#each Object.entries(scores) as [score, factions]}
  <Token square
    {scale}
    image={images[factions[0]]}
    x={(track.x + 146 * score) * scale}
    y={track.y * scale}
    stack={factions.length} />
{/each}
