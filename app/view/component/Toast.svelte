<script context='module'>
  import { writable, get } from 'svelte/store';

  const toasts = writable([]);

  export class Entry {
    constructor(text) { this.text = text; }
    dismiss() { unshift(this); }
  }

  export function unshift(entry) {
    const newToasts = [...get(toasts)];
    let index = -1;
    if (entry) {
      index = newToasts.indexOf(entry);
    } else {
      index = 0;
    }
    if (index !== -1) {
      newToasts.splice(index, 1);
    }
    toasts.set(newToasts);
  }

  export function toast(text) {
    const entry = new Entry(text);
    toasts.set([...get(toasts), entry]);
    return entry;
  }
</script>

<script>
  import { fade, fly } from 'svelte/transition';
  import Box from './Box.svelte';
</script>

{#if $toasts.length}
  <div class='container'>
    {#each $toasts as entry}
      <div
        transition:fly={{ y: 30 }}
        class='toast'
        on:click={() => entry.dismiss()}>
        <Box>
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
    width: 400px;
    transition: opacity 0.2s;
  }

  .toast:hover {
    opacity: 0.9;
  }
</style>
