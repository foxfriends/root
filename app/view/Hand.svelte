<script>
  import { always } from 'ramda';
  import { getSharedCardPath } from '../util/image';

  export let cards;
</script>

<div class='hand'>
  {#each cards as card, i}
    <div class='card' style={`
      background-image: url(${image(cards[0])});
      transform: scale(${cardFocus[i]});
    `} />
  {/each}
</div>

<style>
  .card {
    background-size: cover;
    width: 183px;
    height: 249px;
    border-radius: 8px;
    transform-origin: bottom;
  }
</style>
