<script>
import Marquise from './faction/Marquise.svelte';
import Faction from '../model/Faction';

export let faction, client;
</script>

<div class='play-area'>
  {#if faction === Faction.marquise}
    <Marquise {client} />
  {:else}
    TODO: make this one
  {/if}
</div>

<style>
.play-area {
  width: 100%;
  height: 100%;
}
</style>
