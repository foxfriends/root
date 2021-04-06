<script>
  import { __, compose, find, prop, propEq, unary } from 'ramda';
  import context from '../context';
  import FactionCard from './FactionCard.svelte';
  import Hand from './Hand.svelte';
  import Factions from '../types/Faction';

  const { state, socket } = context();
  $: currentFaction = $state.factions.find(propEq('player', socket.name));

  export let faction;

  const hand = $state
    .hand
    .filter(propEq('faction', faction.faction))
    .map(prop('card'))
    .map(unary(compose(find(__, $state.cards), propEq('id'))));

  $: showCards = faction === currentFaction || faction === Factions.RIVERFOLK;
</script>

<div class='player-area'>
  <div class='player-board'>
    <FactionCard faction={faction.faction} />
  </div>
  <div class='player-hand'>
    <Hand cards={hand} show={showCards} />
  </div>
</div>

<style>
  .player-area {
    box-sizing: border-box;
    padding: 24px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .player-board {
    flex-basis: 0;
    flex-grow: 1;
  }
</style>
