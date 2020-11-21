<script context='module'>
  import { get, writable } from 'svelte/store';

  const toasts = writable([]);

  class Entry {
    constructor(text) {
      this.text = text;
    }

    dismiss() {
      const newToasts = [...get(toasts)];
      const index = newToasts.indexOf(this);
      if (index !== -1) {
        newToasts.splice(index, 1);
      }
      toasts.set(newToasts);
    }
  }

  export function toast(text, timer = 5000) {
    const entry = new Entry(text);
    toasts.set([...get(toasts), entry]);
    if (timer) {
      window.setTimeout(() => entry.dismiss(), timer);
    }
    return entry;
  }
</script>

<script>
  import { fly } from 'svelte/transition';
  import Box from './Box.svelte';
</script>

{#if $toasts.length}
  <div class='container'>
    {#each $toasts as entry}
      <div
        transition:fly={{ y: 30 }}
        class='toast'
        on:click={() => entry.dismiss()}>
        <Box small>
          {entry.text}
        </Box>
      </div>
    {/each}
  </div>
{/if}

<style>
  .container {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 30px;
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: flex-start;
    overflow: hidden;
    pointer-events: none;
  }

  .toast {
    z-index: 1;
    cursor: pointer;
    pointer-events: auto;
    transition: opacity 0.2s;
    font-size: 14pt;

    --Box--border-width: 24px;

    &:hover {
      opacity: 0.9;
    }
  }
</style>
