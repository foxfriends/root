<script>
import { fly } from 'svelte/transition';
import { username, game } from '../store';
import logo from '../image/logo.png';
import Loading from './component/Loading.svelte';
import IdentificationForm from './IdentificationForm.svelte';
import ChooseGameForm from './ChooseGameForm.svelte';
import Lobby from './Lobby.svelte';

export let client;
</script>

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

<div class='cover'>
  {#if client}
    <div class='contents' transition:fly='{{ delay: 250, y: -100, duration: 2000 }}'>
      <img src={logo} />
      {#if !$username}
        <IdentificationForm {client} />
      {:else if !$game}
        <ChooseGameForm {client} />
      {:else}
        <Lobby {client} />
      {/if}
    </div>
  {:else}
    <Loading text='connecting' />
  {/if}
</div>
