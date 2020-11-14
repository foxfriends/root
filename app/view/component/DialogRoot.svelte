<script context='module'>
  import { writable, get } from 'svelte/store';

  const dialogs = writable([]);

  export class Entry {
    constructor(element, dispatch) {
      this.element = element;
      this.dispatch = dispatch;
    }

    remove() { this.dispatch('remove'); }
  }

  export function pop(entry) {
    const newDialogs = [...get(dialogs)];
    let index = -1;
    if (entry) {
      index = newDialogs.indexOf(entry);
    } else {
      index = newDialogs.length - 1;
    }
    if (index !== -1) {
      newDialogs.splice(index, 1);
    }
    dialogs.set(newDialogs);
  }

  export function push(entry) {
    dialogs.set([...get(dialogs), entry]);
  }
</script>

<script>
  import { fly } from 'svelte/transition';

  const containers = [];
  $: $dialogs.forEach((entry, i) => containers[i]?.appendChild(entry.element));
</script>

{#if $dialogs.length}
  <div class='container'>
    {#each $dialogs as entry, i}
      <div
        transition:fly={{ y: 50 }}
        on:outroend={() => entry.remove()}
        bind:this={containers[i]}
        class='dialog' />
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
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .dialog {
    position: absolute;
    z-index: 1;
  }
</style>
