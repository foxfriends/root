<script context='module'>
  import { getContext, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  
  const SCALE = Symbol('Scale');
  export const useScale = () => getContext(SCALE);
</script>

<script>
  export let scale;

  const store = writable();
  $: $store = scale;
  setContext(SCALE, store);
</script>

<slot />
