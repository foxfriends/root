<script>
  import { __, compose, find, prop, propEq } from 'ramda';
  import context from '../context';
  import FactionCard from './FactionCard.svelte';
  import Hand from './Hand.svelte';

  const { state } = context();

  export let faction;
  const hand = $state
    .hand
    .filter(propEq('faction', faction))
    .map(prop('card'))
    .map(compose(find(__, $state.cards), propEq('id')));
</script>

<div class='player-area'>
  <FactionCard faction={faction.faction} />
  <Hand cards={hand} />
</div>

<style>
  .player-area {
    box-sizing: border-box;
    padding: 64px;
    width: 100%;
    height: 100%;
  }
</style>
