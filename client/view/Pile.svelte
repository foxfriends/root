<script>
import Text from './component/Text.svelte';

// TODO: this one needs to allow opening up the list of cards
export let cards;

$: cardCount = cards.length;

const color = [
  'rgb(148, 142, 118)',
  'rgb(182, 176, 150)'
];

$: boxShadow = new Array(Math.ceil(cardCount / 2)).fill(0)
  .map((_, i) => `0 ${i + 1}px 0 ${color[i % 2]}`)
  .join(',');
</script>

{#if cardCount}
  <div class='card' style={`background-image: url(${cards[cards.length - 1]}); box-shadow: ${boxShadow}; transform: translateY(-${Math.ceil(cardCount / 2)}px)`} />
{:else}
  <div class='card empty'>
    <Text text='empty' />
  </div>
{/if}

<style>
/* dedup */
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
