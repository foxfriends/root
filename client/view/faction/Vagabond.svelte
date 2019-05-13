<script>
import { game } from '../../store';
import characterImages from '../../image/card/card-vagabond_character-front.*.jpg';
import Piece from '../../model/Piece';
import Faction from '../../model/Faction';
import Token from '../Token.svelte';
import Deck from '../Deck.svelte';

export let faction;

let width, height;
$: scale = Math.min(width / 2252, height / 1749);
$: card = { x: 1643 * scale, y: 976 * scale };
</script>

<div class={`board ${faction}`} bind:clientWidth={width} bind:clientHeight={height}>
  {#if $game.factionData[faction].character}
    <div class='character' style={`transform: translate(${card.x}px, ${card.y}px); width: ${517 * scale}px; height: ${702 * scale}px`}>
      <Deck cardImage={characterImages[$game.factionData[faction].character]} cardCount={1} />
    </div>
  {/if}
</div>

<style>
.vagabond {
  background-image: url('../../image/card-vagabond-front.jpg');
}

.vagabond2 {
  background-image: url('../../image/card-vagabond2-front.jpg');
}

.board {
  position: relative;
  background-size: contain;
  background-attachment: top left;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
}

.character {
  position: absolute;
  left: 0;
  top: 0;
  transform-origin: top left;
}
</style>
