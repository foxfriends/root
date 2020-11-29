<script>
import cardBack from '../image/card/card-shared-back.jpg';
import cardImages from '../image/card/card-shared-front.*.jpg';
import factionImages from '../image/card-*-front.jpg';
import FactionCard from './FactionCard.svelte';
import Deck from './Deck.svelte';
import Pile from './Pile.svelte';

// let focusedPlayer = get(username);
// $: focusedIndex = $game.factions.indexOf($game.players[focusedPlayer].faction);
let focusedPlayer = '';
let focusedIndex = 0;
let game = {};

function cardImage({ key }) {
  return cardImages[key];
}

let width, height;
export let client;
</script>

<div class='table'>
  <div class='shared'>
    <div class='shared-deck'>
      <Deck cardImage={cardBack} cardCount={$game.cards} />
    </div>
    <div class='discards-deck'>
      <Pile showEmpty cards={$game.discards.map(cardImage)} />
    </div>
  </div>
  <div class='pager'>
    <div class='pages' bind:clientWidth={width} bind:clientHeight={height}>
      {#each $game.factions as faction, i (faction)}
        <div class='page' style={`transform: translateX(${(i - focusedIndex) * 100}%); opacity: ${focusedIndex === i ? 1 : 0}`}>
          <FactionCard {faction} {client} width={width - 40} height={height - 40} />
        </div>
      {/each}
    </div>
    <div class='previews'>
      {#each $game.playerNames as name}
        <!-- svelte-ignore a11y-missing-attribute -->
        <img
          class='preview'
          class:current={name === focusedPlayer}
          src={factionImages[$game.players[name].faction]}
          on:click={() => focusedPlayer = name} />
      {/each}
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

.shared-deck,
.discards-deck {
  margin: 20px;
  width: 183px;
  height: 249px;
}

.pager {
  display: flex;
  flex-direction: column;
  position: relative;
  flex-grow: 1;
  overflow: hidden;
}

.pages {
  width: 100%;
  flex-grow: 1;
}

.page {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% - 128px);
  padding: 20px;
  transition: opacity 0.2s, transform 0.2s;
}

.previews {
  display: flex;
  flex-basis: 128px;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

.preview {
  user-select: none;
  cursor: pointer;
  height: 108px;
  margin: 10px;
}

.preview:not(.current) {
  opacity: 0.7;
}
</style>
