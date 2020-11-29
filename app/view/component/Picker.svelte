<script>
import { createEventDispatcher } from 'svelte';
import Button from './Button.svelte';
import IMG_ARROW from '../../image/arrow.svg';

export let options;
let current = 0;
</script>

<div class='picker'>
  <div class='content'>
    <Button on:click={() => current = (current + options.length - 1) % options.length}>
      <img src={IMG_ARROW} width={55} alt='→' />
    </Button>
    <div class='items'>
      {#each options as option, i}
        <slot {option} isCurrent={current === i} name='option' />
      {/each}
    </div>
    <Button on:click={() => current = (current + 1) % options.length}>
      <img src={IMG_ARROW} class='reverse' width={55} alt='←' />
    </Button>
  </div>
  <div class='select'>
    <slot name='select' current={options[current]} />
  </div>
</div>

<style>
.picker {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

.select {
  flex-basis: 50px;
}

.content {
  position: relative;
  height: 100%;
  width: 100%;
  flex-basis: 0;
  flex-grow: 1;
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
