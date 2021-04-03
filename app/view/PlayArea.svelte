<script>
  import context from '../context';
  import Deck, { front, back } from './Deck.svelte';

  const { state } = context();
</script>

<div class='table'>
  <div class='shared'>
    <div class='deck'>
      <Deck shared cards={$state.cards.map(back)} />
    </div>
    <div class='deck'>
      <Deck shared expandable cards={$state.discards.map(front)} />
    </div>
  </div>
</div>

<style>
  .table {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
  }

  .shared {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    flex-grow: 0;
    padding: 20px;
  }

  .deck {
    margin: 20px;
    width: 183px;
    height: 249px;
  }
</style>
