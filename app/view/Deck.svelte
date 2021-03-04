<script context='module'>
  const FRONT = Symbol('front');
  const BACK = Symbol('back');
  export const front = (card) => ({ card, side: FRONT });
  export const back = (card) => ({ card, side: BACK });
</script>

<script>
  import Text from './component/Text.svelte';
  import { identity, times } from 'ramda';
  import { fmt, pairWith } from '../util/ramda';
  import {
    getEyrieLeaderPath, 
    getSharedCardPath,
    getVagabondCharacterPath,
  } from '../util/image';
  import EyrieLeaders from '../types/EyrieLeader';
  import Vagabonds from '../types/Vagabond';
  import context from '../context';

  const { state } = context();

  // TODO: add reference to all cards, not to current deck state
  const sharedDeck = {
    BACK: '/image/card/card-shared-back.jpg',
    ...Object.fromEntries(
      $state.cards
      .map(pairWith(getSharedCardPath))
    ),
  };
  const questsDeck = { BACK: '/image/card/vagabond-quests/card-vagabond_quest-back.jpg' };
  const leadersDeck = {
    BACK: getEyrieLeaderPath(),
    ...Object.fromEntries(Object
      .values(EyrieLeaders)
      .map(pairWith(getEyrieLeaderPath))),
  };
  const vagabondsDeck = {
    BACK: getVagabondCharacterPath(),
    ...Object.fromEntries(Object
      .values(Vagabonds)
      .map(pairWith(getVagabondCharacterPath))),
  };

  export let shared = false;
  export let quest = false;
  export let leaders = false;
  export let vagabonds = false;
  if ([shared, quest, leaders, vagabonds].filter(identity).length !== 1) {
    throw new TypeError('Deck must have one type');
  }
  $: images = do {
    switch (true) {
      case shared: sharedDeck; break;
      case quest: questsDeck; break;
      case leaders: leadersDeck; break;
      case vagabonds: vagabondsDeck; break;
    }
  };

  export let expandable = false;

  export let cards;

  const EDGE_COLOR = [
    'rgb(148, 142, 118)',
    'rgb(182, 176, 150)',
  ];

  $: boxShadow = times((i) => `0 ${i + 1}px 0 ${EDGE_COLOR[i % 2]}`, Math.ceil(cards.length / 2)).join(',');

  function image({ card, side, suit }) {
    if (side === BACK) { return images.BACK; }

    return images[suit ? `${suit}-${card}` : card];
  }
</script>

{#if cards.length}
  <div class='card' style={`background-image: url(${image(cards[0])}); box-shadow: ${boxShadow}; transform: translateY(-${Math.ceil(cards.length / 2)}px)`} />
{:else}
  <div class='card empty'>
    <Text text='empty' />
  </div>
{/if}

<style>
  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    font-family: var(--font-family--display);
  }

  .empty {
    border: 2px solid rgba(255, 255, 255, 0.7);
    color: rgba(255, 255, 255, 0.7);
  }
</style>
