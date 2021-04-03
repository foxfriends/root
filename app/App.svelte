<script>
  import Flow, { Abort } from './view/component/Flow.svelte';
  import Cover from './view/Cover.svelte';
  import Table from './view/Table.svelte';
  import DialogRoot from './view/component/DialogRoot.svelte';
  import ToastRoot from './view/component/Toast.svelte';
  import { init } from './context';

  init();

  async function * app() {
    for (;;) {
      try {
        yield 'cover';
        yield 'table';
      } catch (error) {
        if (error instanceof Abort) {
          continue;
        }
        // This would be an actual error, so let's just crash...
        throw error;
      }
    }
  }
</script>

<div class='layout'>
  <Flow flow={app} let:state let:next let:abort>
    {#if state === 'cover'}
      <Cover on:next={next} />
    {:else if state === 'table'}
      <Table on:leave={abort} />
    {/if}
  </Flow>
  <DialogRoot />
  <ToastRoot />
</div>

<style>
@import './font/fonts.css';

:global(:root) {
  --font-family--display: 'Luminari';
  --font-family--body: 'Baskerville';
  --color--text: black;
  --color--accent: #DF7F83;
  --color--accent__hover: #C15943;
  --color--background: #FBF7E7;

  /* Factions */
  --color-marquise: #D26024;
  --color-eyrie: #4360AC;
  --color-alliance: #58AE41;
  --color-vagabond: #D7D7D7;
  --color-vagabond2: #353132;
  --color-cult: #E2E019;
  --color-riverfolk: #5CBDAD;
  --color-duchy: #EEC2A3;
  --color-conspiracy: #5B2C87;
  --color-conspiracy-secondary: #A76EAE;
}

:global(body),
.layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
}
</style>
