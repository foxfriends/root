<script>
import Marquise from './faction/Marquise.svelte';
import Eyrie from './faction/Eyrie.svelte';
import Alliance from './faction/Alliance.svelte';
import Vagabond from './faction/Vagabond.svelte';
import Riverfolk from './faction/Riverfolk.svelte';
import Cult from './faction/Cult.svelte';
import Faction from '../model/Faction';

export let width, height;
export let faction, client;
</script>

<div class='play-area'>
  {#if faction === Faction.marquise}
    <Marquise {client} {width} {height} />
  {:else if faction === Faction.eyrie}
    <Eyrie {client} {width} {height} />
  {:else if faction === Faction.alliance}
    <Alliance {client} {width} {height} />
  {:else if faction === Faction.vagabond || faction === Faction.vagabond2}
    <Vagabond {client} {faction} {width} {height} />
  {:else if faction === Faction.riverfolk}
    <Riverfolk {client} {width} {height} />
  {:else if faction === Faction.cult}
    <Cult {client} {width} {height} />
  {/if}
</div>

<style>
.play-area {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
</style>
