<script>
import { propEq } from 'ramda';
import FACTION_BOARDS from '../image/faction';
import context from '../context';
import FactionCard from './FactionCard.svelte';
import Deck from './Deck.svelte';

const { state, socket } = context();

let currentFaction = $state.factions.find(propEq('player', socket.name)).faction;
$: currentIndex = $state.factions.findIndex(propEq('faction', currentFaction));
</script>

<div class='table'>
  <div class='shared'>
    <div class='deck'>
      <Deck shared down cards={$state.cards} />
    </div>
    <div class='deck'>
      <Deck shared up cards={$state.discards} />
    </div>
  </div>
  <div class='pager'>
    <div class='pages'>
      {#each $state.factions as { faction }, i (faction)}
        <div
          class='page'
          class:current={faction === currentFaction}
          style='transform: translateX({(i - currentIndex) * 100}%);'>
          <div class='page-content'>
            <FactionCard {faction} />
          </div>
        </div>
      {/each}
    </div>
    <div class='previews'>
      {#each $state.factions as { faction } (faction)}
        <!-- svelte-ignore a11y-missing-attribute-->
        <img
          class='preview'
          class:current={faction === currentFaction}
          src={FACTION_BOARDS[faction].front}
          on:click={() => currentFaction = faction} />
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

.deck {
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
  opacity: 0;

  &.current {
    opacity: 1;
  }
}

.page-content {
  box-sizing: border-box;
  padding: 40px;
  height: 100%;
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
  opacity: 0.7;

  &.current { opacity: 1; }
}
</style>
