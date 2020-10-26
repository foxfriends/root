<script>
  import { fly } from 'svelte/transition';
  import stores from '../stores';
  import logo from 'url:../image/logo.png';
  import IdentificationForm from './IdentificationForm.svelte';
  // import ChooseGameForm from './ChooseGameForm.svelte';
  // import Lobby from './Lobby.svelte';
  import _ from '../util/lens';

  const { state } = stores();
  const username = _.user.name(state);
  const game = _.lobby.name(state);
</script>

<div class='cover'>
  <div class='contents' in:fly='{{ delay: 250, y: -100, duration: 2000 }}'>
    <img src={logo} />
    {#if !$username}
      <IdentificationForm />
    {:else if !$game}
      <!--ChooseGameForm /-->
    {:else}
      <!--Lobby /-->
    {/if}
  </div>
</div>

<style>
  .cover {
    width: 100vw;
    height: 100vh;
    background-image: url('../image/cover.jpg');
    background-size: cover;
    background-position: center;
    font-family: var(--font-family--body);
  }

  .contents {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
</style>
