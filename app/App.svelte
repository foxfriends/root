<script>
  import Flow from './view/component/Flow.svelte';
  import Cover from './view/Cover.svelte';
  import DialogRoot from './view/component/DialogRoot.svelte';
  import ToastRoot from './view/component/Toast.svelte';
  import { init } from './context';

  init();

  async function * app() {
    yield 'cover';
    console.log('Game is started!');
  }
</script>

<div class='layout'>
  <Flow flow={app} let:state let:next let:abort>
    {#if state === 'cover'}
      <Cover on:next={next} />
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
}

:global(body),
.layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
}
</style>
