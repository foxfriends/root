<script context="module">
  export function driver(begin) {
    const state = writable();
    const driver = async function * drive(...args) {
      const flow = await begin(...args);
      let step = flow.next();
      try {
        for (;;) {
          const { value, done } = await step;
          if (done) { return value; }
          state.set(value);
          step = flow.next(yield);
        }
      } catch {}
    }
    driver.state = state;
    return driver;
  }
</script>

<script>
  import Dialog from './Dialog.svelte';
  import Button from '../Button.svelte';
  import Card from '../Card.svelte';
  import CardHeader from '../CardHeader.svelte';

  export let driver;

  $: state = driver.state;
  let dialog;
  $: resolve = (option) => () => {
    $confirmation.resolve(option);
    dialog.close();
  };
  function clear() {
    $confirmation.cancel();
    confirmation.set(null);
  }
</script>

{#if $state}

{/if}
