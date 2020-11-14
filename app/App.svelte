<script>
  import Cover from './view/Cover.svelte';
  import DialogRoot from './view/component/DialogRoot.svelte';
  import { init } from './context';

  init();
</script>

<div class='layout'>
  <Cover />
  <DialogRoot />
</div>

<style>
  :global(:root) {
    --font-family--display: 'Luminari';
    --font-family--body: 'Baskerville';

    --color--text: black;
    --color--accent: #DF7F83;
    --color--accent__hover: #c15943;
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
