<script>
import Marquise from './faction/Marquise.svelte';
import Eyrie from './faction/Eyrie.svelte';
import Faction from '../model/Faction';

export let faction, client;
</script>

<div class='play-area'>
  {#if faction === Faction.marquise}
    <Marquise {client} />
  {:else if faction === Faction.eyrie}
    <Eyrie {client} />
  {:else}
    TODO: make this one
  {/if}
</div>

<style>
.play-area {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 0 20px 20px 20px;
}
</style>
