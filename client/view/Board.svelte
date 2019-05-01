<script>
import { game, username } from '../store';
import FactionPicker from './FactionPicker.svelte';

export let client;
</script>

<div class='board'>
</div>
{#if $game.players[$username].faction === null}
  <FactionPicker {client} />
{/if}

<style>
</style>
