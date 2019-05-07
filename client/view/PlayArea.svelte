<script>
import { get } from 'svelte/store';
import { game, username } from '../store';
import cardBack from '../image/card/card-shared-back.jpg';
import cardImages from '../image/card/card-shared-front.*.jpg';
import Deck from './Deck.svelte';
import Pile from './Pile.svelte';

let focusedPlayer = get(username);

function cardImage({ key }) {
  return cardImages[key];
}

export let client;
</script>

<div class='shared'>
  <div class='shared-deck'>
    <Deck {cardBack} cardCount={$game.cards} />
  </div>
  <div class='discards-deck'>
    <Pile cards={$game.discards.map(cardImage)} />
  </div>
</div>

<style>
.shared {
  display: flex;
}

.shared-deck, .discards-deck {
  margin: 20px;
  width: 183px;
  height: 249px;
}
</style>
