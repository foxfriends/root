<script>
import { game, username } from '../store';
import images from '../image/map-*.jpg';
import FactionPicker from './FactionPicker.svelte';

export let client;
</script>

<div class='container'>
  <img class='board' src={images[$game.board.name]} />
</div>
{#if $game.players[$username].faction === null}
  <FactionPicker {client} />
{/if}

<style>
.container {
  position: relative;
}

.board {
  pointer-events: none;
}
</style>
