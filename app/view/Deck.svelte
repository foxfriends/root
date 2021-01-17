<script>
import { cond, always } from 'ramda';
import * as SHARED_DECK from '../image/card/shared';
import * as QUEST_DECK from '../image/card/quest';
import Text from './component/Text.svelte';

export let shared = false;
export let quest = false;
if (shared === quest) {
  throw new TypeError('Deck must be shared or quest');
}
$: images = do {
  switch (true) {
    case shared: SHARED_DECK; break;
    case quest: QUEST_DECK; break;
  }
};

export let up = false;
export let down = false;
if (up === down) {
  throw new TypeError('Deck must be face up or face down');
}

export let cards;

const EDGE_COLOR = [
  'rgb(148, 142, 118)',
  'rgb(182, 176, 150)',
];

$: boxShadow = new Array(Math.ceil(cards.length / 2))
  .fill(0)
  .map((_, i) => `0 ${i + 1}px 0 ${EDGE_COLOR[i % 2]}`)
  .join(',');

function image(card) {
  if (down) { return images.BACK; }
  return images[card]; // TODO: this won't work
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
