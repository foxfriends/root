<script>
import Marquise from './faction/Marquise.svelte';
import Eyrie from './faction/Eyrie.svelte';
import Alliance from './faction/Alliance.svelte';
import Vagabond from './faction/Vagabond.svelte';
import Riverfolk from './faction/Riverfolk.svelte';
import Faction from '../model/Faction';

export let faction, client;
</script>

<div class='play-area'>
  {#if faction === Faction.marquise}
    <Marquise {client} />
  {:else if faction === Faction.eyrie}
    <Eyrie {client} />
  {:else if faction === Faction.alliance}
    <Alliance {client} />
  {:else if faction === Faction.vagabond || faction === Faction.vagabond2}
    <Vagabond {client} {faction} />
  {:else if faction === Faction.riverfolk}
    <Riverfolk {client} />
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
