<script>
import Deck from './Deck.svelte';
import Message from '../model/Message';

let containerWidth;

export let cards;
export let client;

$: scale = cards.length > 10
  ? 1
  : (containerWidth / 4 - 40) / 183;

function notify(value) {
  client.notify(Message.direct('Prompts:card', { value }));
}
</script>

<div class='container' bind:clientWidth={containerWidth}>
  {#each cards as card}
    <div
      class='card'
      class:available={card.available !== false}
      on:click={() => card.available !== false && notify(card.value)}
      style={`width: ${183 * scale}px; height: ${249 * scale}px`}>
      <Deck cardImage={card.image} cardCount={1} />
    </div>
  {/each}
</div>

<style>
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-around;
  overflow: auto;
  max-height: 100%;
}

.card {
  margin: 20px;
  flex-grow: 0;
}

.card.available {
  cursor: pointer;
}
</style>
