<script>
export let cardBack;
export let cardCount;

const color = [
  'rgb(148, 142, 118)',
  'rgb(182, 176, 150)'
];

$: boxShadow = new Array(Math.floor(cardCount / 2)).fill(0)
  .map((_, i) => `0 ${i + 1}px 0 ${color[i % 2]}`)
  .join(',');
</script>

{#if cardCount}
  <div class='card' style={`background-image: url(${cardBack}); box-shadow: ${boxShadow}; transform: translateY(-${cardCount / 2}px)`} />
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
