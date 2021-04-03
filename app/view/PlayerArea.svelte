<script>
  import FactionCard from './FactionCard.svelte';

  export let faction;
</script>

<div class='player-area'>
  <FactionCard faction={faction.faction} />
</div>

<style>
  .player-area {
    box-sizing: border-box;
    padding: 64px;
    width: 100%;
    height: 100%;
  }
</style>
