<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import { Entry, push, pop } from './DialogRoot.svelte';

  const dispatch = createEventDispatcher();

  let container;
  let entry;

  export let backed = false;

  onMount(() => {
    entry = new Entry(container, dispatch, backed);
    push(entry);
    return () => pop(entry);
  });
  export function close() {
    pop(entry);
  }
</script>

<div bind:this={container}>
  <slot />
</div>
