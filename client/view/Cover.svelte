<script>
import { fly } from 'svelte/transition';
import { username } from '../store';
import logo from '../image/logo.png';
import Loading from './component/Loading.svelte';
import IdentificationForm from './IdentificationForm.svelte';
import ChooseGameForm from './ChooseGameForm.svelte';

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
      {:else}
        <ChooseGameForm {client} />
      {/if}
    </div>
  {:else}
    <Loading text='connecting' />
  {/if}
</div>
