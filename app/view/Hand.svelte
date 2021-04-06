<script>
  import { getSharedCardPath } from '../util/image';

  export let cards;
  export let show;
</script>

<div class='hand'>
  {#each cards as card, i (card.id)}
    <div class='card' style={`
      background-image: url(${getSharedCardPath(show ? card : null)});
    `} />
  {/each}
</div>

<style>
  .hand {
    display: flex;
    gap: 16px;
  }

  .card {
    background-size: cover;
    width: 183px;
    height: 249px;
    border-radius: 8px;
    transform-origin: bottom;
  }
</style>
