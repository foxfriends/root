<script>
import { createEventDispatcher } from 'svelte';
import Text from './Text.svelte';
import arrow from '../../image/arrow.svg';

const dispatch = createEventDispatcher();

export let options;
let current = 0;
</script>

<div class='picker'>
  <div class='content'>
    <button
      class='button'
      on:click={() => current = (current + options - 1) % options}>
      <img src={arrow} width={55} />
    </button>
    <div class='items'>
      <slot {current} />
    </div>
    <button
      class='button'
      on:click={() => current = (current + 1) % options}>
      <img src={arrow} class='reverse' width={55} />
    </button>
  </div>
  <button class='select' on:click={() => dispatch('select', { selection: current })}>
    <Text text='select' />
  </button>
</div>

<style>
.picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.select, .button {
  background: none;
  border: none;
  padding: 16px;
  font-family: var(--font-family--display);
  font-size: 20px;
  color: var(--color--accent);
  cursor: pointer;
}

.button {
  margin: 0 8px;
}

.button:hover {
  opacity: 0.5;
}

.select:hover {
  color: var(--color--accent__hover);
}

.content {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
}

.items {
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: 0;
  height: 100%;
}

.reverse {
  transform: rotateY(180deg);
}
</style>
