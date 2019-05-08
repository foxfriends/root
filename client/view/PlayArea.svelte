<script>
import { get } from 'svelte/store';
import { game, username } from '../store';
import cardBack from '../image/card/card-shared-back.jpg';
import cardImages from '../image/card/card-shared-front.*.jpg';
import FactionCard from './FactionCard.svelte';
import Deck from './Deck.svelte';
import Pile from './Pile.svelte';

let focusedPlayer = get(username);

function cardImage({ key }) {
  return cardImages[key];
}

export let client;
</script>

<div class='table'>
  <div class='shared'>
    <div class='shared-deck'>
      <Deck cardImage={cardBack} cardCount={$game.cards} />
    </div>
    <div class='discards-deck'>
      <Pile cards={$game.discards.map(cardImage)} />
    </div>
  </div>
  <div class='pager'>
    {#each $game.factions as faction, i}
      <div class='page' style={`transform: translateX(${i * 100}%)`}>
        <FactionCard faction={'eyrie'} {client} />
      </div>
    {/each}
  </div>
</div>

<style>
.table {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.shared {
  display: flex;
  flex-grow: 0;
}

.shared-deck, .discards-deck {
  margin: 20px;
  width: 183px;
  height: 249px;
}

.pager {
  position: relative;
  flex-grow: 1;
  overflow: hidden;
}

.page {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
