<script>
import Marquise from './faction/Marquise.svelte';
import Eyrie from './faction/Eyrie.svelte';
// import Alliance from './faction/Alliance.svelte';
// import Vagabond from './faction/Vagabond.svelte';
// import Riverfolk from './faction/Riverfolk.svelte';
// import Cult from './faction/Cult.svelte';
// import Duchy from './faction/Duchy.svelte';
// import Conspiracy from './faction/Conspiracy.svelte';
import Faction from '../types/Faction';

export let faction;
</script>

{#if faction === Faction.MARQUISE}
  <Marquise />
{:else if faction === Faction.EYRIE}
  <Eyrie />
{:else}
  TODO
{/if}
<!--
{:else if faction === Faction.EYRIE}
  <Eyrie />
{:else if faction === Faction.ALLIANCE}
  <Alliance />
{:else if faction === Faction.VAGABOND || faction === Faction.VAGABOND2}
  <Vagabond {faction} />
{:else if faction === Faction.RIVERFOLK}
  <Riverfolk />
{:else if faction === Faction.CULT}
  <Cult />
{:else if faction === Faction.DUCHY}
  <Duchy />
{:else if faction === Faction.CONSPIRACY}
  <Conspiracy />
{/if}
-->
